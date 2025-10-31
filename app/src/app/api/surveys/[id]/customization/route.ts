import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const customizationSchema = z.object({
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color hex inválido").optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color hex inválido").optional(),
  logoUrl: z.string().url("URL inválida").or(z.literal("")).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const validation = customizationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify survey belongs to user's tenant
    const existingSurvey = await db.query.surveys.findFirst({
      where: and(
        eq(surveys.id, id),
        eq(surveys.tenantId, session.user.tenantId)
      ),
    });

    if (!existingSurvey) {
      return NextResponse.json(
        { error: "Encuesta no encontrada" },
        { status: 404 }
      );
    }

    // Update customization fields
    const [updatedSurvey] = await db
      .update(surveys)
      .set({
        brandColor: validation.data.brandColor,
        accentColor: validation.data.accentColor,
        logoUrl: validation.data.logoUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(surveys.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      survey: updatedSurvey,
    });
  } catch (error) {
    console.error("Error updating customization:", error);
    return NextResponse.json(
      { error: "Error al actualizar personalización" },
      { status: 500 }
    );
  }
}
