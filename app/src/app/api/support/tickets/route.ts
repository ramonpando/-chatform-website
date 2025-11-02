import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { supportTickets } from "@/lib/db/schema";

/**
 * POST /api/support/tickets
 * Create a new support ticket
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { subject, category, priority, message, userEmail, userName, tenantId } = await req.json();

    // Validate required fields
    if (!subject || !category || !priority || !message || !userEmail || !tenantId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validate subject length
    if (subject.length > 200) {
      return NextResponse.json(
        { error: "El asunto no puede exceder 200 caracteres" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "El mensaje no puede exceder 2000 caracteres" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["technical", "billing", "feature", "account", "api", "other"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Categoría inválida" },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ["low", "normal", "high"];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: "Prioridad inválida" },
        { status: 400 }
      );
    }

    // Generate unique ticket number (e.g., TKT-ABC123)
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Create ticket in database
    const [ticket] = await db.insert(supportTickets).values({
      tenantId,
      userId: session.user.id,
      ticketNumber,
      subject,
      category,
      priority,
      message,
      userEmail,
      userName: userName || null,
      status: "open",
    }).returning();

    // TODO: Send email notification to support team
    // You can integrate with your email service here (e.g., Resend, SendGrid, etc.)

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json(
      { error: "Error al crear el ticket. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
