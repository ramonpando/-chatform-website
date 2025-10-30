import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, tenants, tenantUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Contraseña debe tener mínimo 8 caracteres"),
  name: z.string().min(2, "Nombre debe tener mínimo 2 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ya registrado" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and tenant in transaction
    const result = await db.transaction(async (tx) => {
      // Create user
      const [user] = await tx.insert(users).values({
        email,
        name,
        passwordHash,
      }).returning();

      // Create tenant (slug from nanoid)
      const slug = nanoid(10);
      const [tenant] = await tx.insert(tenants).values({
        name: name,
        slug,
        plan: 'free',
        responsesLimit: 50,
        surveysLimit: 1,
        sendCreditsLimit: 0,
      }).returning();

      // Link user to tenant
      await tx.insert(tenantUsers).values({
        userId: user.id,
        tenantId: tenant.id,
        role: 'owner',
      });

      return { user, tenant };
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      tenant: {
        id: result.tenant.id,
        slug: result.tenant.slug,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: "Error al crear cuenta" },
      { status: 500 }
    );
  }
}
