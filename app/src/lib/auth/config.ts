import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users, tenants, tenantUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { createTenantAwareAdapter } from "@/lib/auth/adapter";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId: string;
      tenantSlug: string;
      tenantPlan: string;
    } & DefaultSession["user"];
  }

  interface User {
    tenantId?: string;
    tenantSlug?: string;
    tenantPlan?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Required for production with proxies
  session: { strategy: "jwt" },
  adapter: createTenantAwareAdapter(),
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return null;
        }

        // Get tenant info
        const tenantUser = await db.query.tenantUsers.findFirst({
          where: eq(tenantUsers.userId, user.id),
          with: {
            tenant: true,
          },
        });

        if (!tenantUser) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: tenantUser.tenant.id,
          tenantSlug: tenantUser.tenant.slug,
          tenantPlan: tenantUser.tenant.plan,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) {
        return false;
      }

      const tenantUser = await db.query.tenantUsers.findFirst({
        where: eq(tenantUsers.userId, user.id),
        with: {
          tenant: true,
        },
      });

      if (tenantUser?.tenant) {
        user.tenantId = tenantUser.tenant.id;
        user.tenantSlug = tenantUser.tenant.slug;
        user.tenantPlan = tenantUser.tenant.plan;
        return true;
      }

      const slug = nanoid(10);
      const [tenant] = await db.insert(tenants).values({
        name: user.name || user.email?.split("@")[0] || "Workspace",
        slug,
        plan: "free",
      }).returning();

      await db.insert(tenantUsers).values({
        tenantId: tenant.id,
        userId: user.id,
        role: "owner",
      });

      user.tenantId = tenant.id;
      user.tenantSlug = tenant.slug;
      user.tenantPlan = tenant.plan;

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.userId = user.id;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.tenantPlan = user.tenantPlan;
      }

      // Update session
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantSlug = token.tenantSlug as string;
        session.user.tenantPlan = token.tenantPlan as string;
      }

      return session;
    },
  },
});
