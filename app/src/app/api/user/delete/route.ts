import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, tenants, tenantUsers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { isOwner } from "@/lib/auth/rbac";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { password, confirmation } = body;

    // Validate confirmation text
    if (confirmation !== "ELIMINAR") {
      return NextResponse.json(
        { error: "Debes escribir 'ELIMINAR' para confirmar" },
        { status: 400 }
      );
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verify password (if user has one - OAuth users might not)
    if (user.passwordHash) {
      if (!password) {
        return NextResponse.json(
          { error: "Contraseña requerida" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Contraseña incorrecta" },
          { status: 401 }
        );
      }
    }

    // Check if user is the owner of the tenant
    const userIsOwner = await isOwner(session.user.id, session.user.tenantId);

    if (userIsOwner) {
      // If owner, delete entire tenant and all associated data
      // Cascade delete will handle surveys, questions, responses, etc.
      await db.delete(tenants).where(eq(tenants.id, session.user.tenantId));

      console.log(`🗑️  Tenant ${session.user.tenantId} and all data deleted by owner ${session.user.id}`);
    } else {
      // If not owner, just remove user from tenant
      await db
        .delete(tenantUsers)
        .where(
          and(
            eq(tenantUsers.userId, session.user.id),
            eq(tenantUsers.tenantId, session.user.tenantId)
          )
        );

      console.log(`🗑️  User ${session.user.id} removed from tenant ${session.user.tenantId}`);
    }

    // Check if user has other tenant memberships
    const otherMemberships = await db.query.tenantUsers.findMany({
      where: eq(tenantUsers.userId, session.user.id),
    });

    // If no other memberships, delete user account
    if (otherMemberships.length === 0) {
      await db.delete(users).where(eq(users.id, session.user.id));
      console.log(`🗑️  User account ${session.user.id} completely deleted`);
    }

    return NextResponse.json({
      success: true,
      message: userIsOwner
        ? "Cuenta y todos los datos eliminados exitosamente"
        : "Cuenta eliminada exitosamente",
    });
  } catch (error: any) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Error al eliminar cuenta" },
      { status: 500 }
    );
  }
}
