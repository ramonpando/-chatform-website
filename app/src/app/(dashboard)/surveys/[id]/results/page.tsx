import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Users,
  Eye,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default async function SurveyResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Get survey with questions
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

  // TODO: Get responses from DB when we have them
  const responses = [];
  const responseCount = survey.responseCount || 0;
  const viewCount = survey.viewCount || 0;
  const completionRate =
    viewCount > 0 ? Math.round((responseCount / viewCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/surveys"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
            <p className="mt-1 text-gray-600">
              Resultados y analíticas de la encuesta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/surveys/${survey.id}/edit`}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Editar Encuesta
          </Link>
          <button
            disabled={responseCount === 0}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Respuestas"
          value={responseCount.toString()}
          trend="+12% vs último mes"
          trendUp={true}
        />
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Vistas"
          value={viewCount.toString()}
          trend="+8% vs último mes"
          trendUp={true}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Tasa de completado"
          value={`${completionRate}%`}
          trend="+5% vs último mes"
          trendUp={true}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Tiempo promedio"
          value="2m 34s"
          trend="-12s vs último mes"
          trendUp={true}
        />
      </div>

      {/* Questions Results */}
      {responseCount === 0 ? (
        <EmptyState surveyId={survey.id} />
      ) : (
        <div className="space-y-6">
          {survey.questions.map((question, index) => {
            // Parse options if it's multiple choice
            const options = question.options
              ? JSON.parse(question.options as string)
              : null;

            return (
              <QuestionResult
                key={question.id}
                index={index}
                question={question.questionText}
                type={
                  question.questionType as
                    | "multiple_choice"
                    | "rating"
                    | "open_text"
                }
                options={options}
                responses={[]} // TODO: Filter responses for this question
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p
          className={`text-sm mt-2 ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ surveyId }: { surveyId: string }) {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Aún no tienes respuestas
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Comparte tu encuesta para empezar a recibir respuestas. Puedes
        compartirla por WhatsApp, QR o link directo.
      </p>
      <Link
        href={`/surveys/${surveyId}/share`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Compartir Encuesta
      </Link>
    </div>
  );
}

function QuestionResult({
  index,
  question,
  type,
  options,
  responses,
}: {
  index: number;
  question: string;
  type: "multiple_choice" | "rating" | "open_text";
  options: string[] | null;
  responses: any[];
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Pregunta {index + 1}</div>
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      </div>

      {type === "multiple_choice" && options && (
        <div className="space-y-3">
          {options.map((option, i) => {
            // TODO: Calculate actual percentage from responses
            const percentage = Math.floor(Math.random() * 100);
            const count = Math.floor(Math.random() * 50);

            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{option}</span>
                  <span className="text-gray-500">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === "rating" && (
        <div className="space-y-3">
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-gray-900 mb-2">8.5</div>
            <div className="text-sm text-gray-500">Calificación promedio</div>
          </div>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const count = Math.floor(Math.random() * 20);
              const maxCount = 20;
              const height = (count / maxCount) * 100;

              return (
                <div key={num} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full bg-blue-600 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{num}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {type === "open_text" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            {responses.length} respuestas de texto
          </p>
          {responses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aún no hay respuestas de texto
            </div>
          ) : (
            <div className="space-y-3">
              {responses.slice(0, 5).map((response: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-gray-900">{response.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {responses.length > 5 && (
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ver todas las respuestas ({responses.length})
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
