"use client";

import { useMemo } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";

interface ChartData {
  date: string;
  count: number;
}

export function AnalyticsCharts({ data }: { data: ChartData[] }) {
  // Fill missing dates with 0
  const filledData = useMemo(() => {
    if (data.length === 0) return [];

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 30 days including today

    const result: ChartData[] = [];
    const dataMap = new Map(data.map((d) => [d.date, d.count]));

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      result.push({
        date: dateStr,
        count: dataMap.get(dateStr) || 0,
      });
    }

    return result;
  }, [data]);

  const maxCount = Math.max(...filledData.map((d) => d.count), 1);
  const totalCount = filledData.reduce((sum, d) => sum + d.count, 0);
  const avgCount = filledData.length > 0 ? totalCount / filledData.length : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Respuestas en el Tiempo
              </h3>
              <p className="text-sm text-slate-600 mt-1">Últimos 30 días</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filledData.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No hay datos aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple bar chart */}
              <div className="flex items-end justify-between gap-1 h-48">
                {filledData.map((item, index) => {
                  const height = (item.count / maxCount) * 100;
                  const isWeekend =
                    new Date(item.date).getDay() === 0 ||
                    new Date(item.date).getDay() === 6;

                  return (
                    <div
                      key={item.date}
                      className="flex-1 flex flex-col items-center group relative"
                    >
                      <div className="w-full flex items-end justify-center h-full">
                        <div
                          className={`w-full rounded-t transition-all ${
                            item.count > 0
                              ? "bg-gradient-to-t from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                              : "bg-slate-100"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        {new Date(item.date).toLocaleDateString("es", {
                          month: "short",
                          day: "numeric",
                        })}
                        : {item.count} respuestas
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels (show every 5 days) */}
              <div className="flex justify-between text-xs text-slate-500">
                {filledData
                  .filter((_, i) => i % 5 === 0 || i === filledData.length - 1)
                  .map((item) => (
                    <span key={item.date}>
                      {new Date(item.date).toLocaleDateString("es", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Resumen Estadístico
          </h3>
          <p className="text-sm text-slate-600 mt-1">Métricas calculadas</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Average per day */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Promedio Diario
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {avgCount.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((avgCount / maxCount) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Peak day */}
          {filledData.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Día Pico
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {maxCount}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {new Date(
                  filledData.reduce((prev, curr) =>
                    curr.count > prev.count ? curr : prev
                  ).date
                ).toLocaleDateString("es", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Days with responses */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Días Activos
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {filledData.filter((d) => d.count > 0).length}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full"
                style={{
                  width: `${
                    (filledData.filter((d) => d.count > 0).length / 30) * 100
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">de los últimos 30 días</p>
          </div>

          {/* Total this week */}
          {filledData.length >= 7 && (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Esta Semana
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {filledData.slice(-7).reduce((sum, d) => sum + d.count, 0)}
                </span>
              </div>
              <p className="text-xs text-slate-500">Últimos 7 días</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
