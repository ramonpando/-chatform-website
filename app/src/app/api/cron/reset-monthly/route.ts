import { NextResponse } from "next/server";
import { resetMonthlyCounters } from "@/lib/plan-limits";

/**
 * Cron job to reset monthly WhatsApp response counters
 * Should run on the 1st of every month at 00:00 UTC
 *
 * Vercel Cron configuration in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/reset-monthly",
 *     "schedule": "0 0 1 * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify this is a Vercel Cron request (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Reset monthly counters for all tenants
    await resetMonthlyCounters();

    console.log(`✅ Monthly counters reset successfully at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: "Monthly counters reset successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error resetting monthly counters:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
