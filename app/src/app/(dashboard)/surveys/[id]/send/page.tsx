import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, tenants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BulkSendClient } from "@/components/surveys/bulk-send-client";

export default async function BulkSendPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  // Get survey
  const survey = await db.query.surveys.findFirst({
    where: and(
      eq(surveys.id, id),
      eq(surveys.tenantId, session.user.tenantId)
    ),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
      },
    },
  });

  if (!survey) {
    notFound();
  }

  // Get tenant info for credits
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.user.tenantId),
  });

  if (!tenant) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/surveys/${survey.id}/share`}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Envío Masivo</h1>
            <p className="mt-1 text-slate-600">{survey.title}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <BulkSendClient
        surveyId={survey.id}
        surveyTitle={survey.title}
        questionCount={survey.questions.length}
        creditsAvailable={tenant.sendCreditsLimit - tenant.sendCreditsUsed}
        hasApiKey={!!tenant.apiKeyHash}
        apiKeyPrefix={tenant.apiKeyPrefix || undefined}
      />
    </div>
  );
}
