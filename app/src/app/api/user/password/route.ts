import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Contraseña actual y nueva son requeridas" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 8 caracteres" },
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

    // Check if user has password (might be OAuth only)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Esta cuenta usa OAuth. No puedes cambiar la contraseña." },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error: any) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Error al actualizar contraseña" },
      { status: 500 }
    );
  }
}
