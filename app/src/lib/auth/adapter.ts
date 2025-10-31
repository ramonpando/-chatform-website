import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { db } from "@/lib/db";
import { tenants, tenantUsers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

type DbUser = typeof users.$inferSelect;

async function getTenantInfo(userId: string) {
  return db.query.tenantUsers.findFirst({
    where: eq(tenantUsers.userId, userId),
    with: {
      tenant: true,
    },
  });
}

function mapUserWithTenant(row: DbUser, tenantData?: { tenant: typeof tenants.$inferSelect }) {
  if (!row) return null;

  const tenant = tenantData?.tenant;

  return {
    id: row.id,
    email: row.email,
    emailVerified: null,
    name: row.name,
    image: null,
    tenantId: tenant?.id,
    tenantSlug: tenant?.slug,
    tenantPlan: tenant?.plan,
  } satisfies AdapterUser & {
    tenantId?: string;
    tenantSlug?: string;
    tenantPlan?: string;
  };
}

async function ensureTenantForUser(user: DbUser) {
  const existingTenantUser = await getTenantInfo(user.id);
  if (existingTenantUser) {
    return existingTenantUser;
  }

  const slug = nanoid(10);

  return db.transaction(async (tx) => {
    const baseName = user.name || user.email?.split("@")[0] || "Workspace";

    const [tenant] = await tx
      .insert(tenants)
      .values({
        name: baseName,
        slug,
        plan: "free",
      })
      .returning();

    await tx.insert(tenantUsers).values({
      tenantId: tenant.id,
      userId: user.id,
      role: "owner",
    });

    return { tenant };
  });
}

export function createTenantAwareAdapter(): Adapter {
  return {
    async createUser(data) {
      if (!data.email) {
        throw new Error("Email requerido para crear usuario");
      }

      try {
        return await db.transaction(async (tx) => {
          const [user] = await tx
            .insert(users)
            .values({
              email: data.email,
              name: data.name,
            })
            .returning();

          const slug = nanoid(10);
          const baseName = user.name || user.email?.split("@")[0] || "Workspace";
          const [tenant] = await tx
            .insert(tenants)
            .values({
              name: baseName,
              slug,
              plan: "free",
            })
            .returning();

          await tx.insert(tenantUsers).values({
            tenantId: tenant.id,
            userId: user.id,
            role: "owner",
          });

          return mapUserWithTenant(user, { tenant })!;
        });
      } catch (error) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, data.email),
        });

        if (!existingUser) {
          throw error;
        }

        const tenantData = await ensureTenantForUser(existingUser);
        const mapped = mapUserWithTenant(existingUser, tenantData);
        if (!mapped) {
          throw error;
        }
        return mapped;
      }
    },

    async getUser(id) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      if (!user) return null;

      const tenantData = await getTenantInfo(user.id);
      return mapUserWithTenant(user, tenantData);
    },

    async getUserByEmail(email) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!user) return null;

      const tenantData = await getTenantInfo(user.id);
      return mapUserWithTenant(user, tenantData);
    },

    async getUserByAccount({ provider, providerAccountId }) {
      if (provider !== "google") {
        return null;
      }

      const user = await db.query.users.findFirst({
        where: eq(users.googleId, providerAccountId),
      });

      if (!user) return null;

      const tenantData = await getTenantInfo(user.id);
      return mapUserWithTenant(user, tenantData);
    },

    async updateUser(data) {
      if (!data.id) {
        throw new Error("ID requerido para actualizar usuario");
      }

      const updateValues: Partial<typeof users.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (typeof data.name !== "undefined") {
        updateValues.name = data.name ?? null;
      }

      if (typeof data.email !== "undefined") {
        updateValues.email = data.email!;
      }

      const [updated] = await db
        .update(users)
        .set(updateValues)
        .where(eq(users.id, data.id))
        .returning();

      if (!updated) return null;

      const tenantData = await getTenantInfo(updated.id);
      return mapUserWithTenant(updated, tenantData);
    },

    async deleteUser(id) {
      await db.delete(users).where(eq(users.id, id));
    },

    async linkAccount(account) {
      if (account.provider === "google") {
        await db
          .update(users)
          .set({
            googleId: account.providerAccountId,
            updatedAt: new Date(),
          })
          .where(eq(users.id, account.userId));
      }

      return account as AdapterAccount;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      if (provider === "google") {
        await db
          .update(users)
          .set({ googleId: null, updatedAt: new Date() })
          .where(eq(users.googleId, providerAccountId));
      }
    },

    async getSessionAndUser() {
      return null;
    },

    async createSession() {
      return null;
    },

    async updateSession() {
      return null;
    },

    async deleteSession() {
      return null;
    },

    async createVerificationToken() {
      throw new Error("Email verification no soportado");
    },

    async useVerificationToken() {
      return null;
    },
  };
}
