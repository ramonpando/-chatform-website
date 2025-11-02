"use client";

import { useState } from "react";
import {
  SURVEY_TEMPLATES,
  CATEGORY_METADATA,
  type SurveyTemplate,
  type TemplateCategory,
  getTemplatesByCategory,
  getRecommendedTemplates,
} from "@/lib/constants/survey-templates";
import { Search, X, Sparkles, Clock } from "lucide-react";

interface TemplateSelectorProps {
  onSelect: (template: SurveyTemplate) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all" | "recommended">("recommended");

  // Filter templates based on search and category
  const filteredTemplates = (() => {
    let templates = SURVEY_TEMPLATES;

    // Filter by category
    if (selectedCategory === "recommended") {
      templates = getRecommendedTemplates();
    } else if (selectedCategory !== "all") {
      templates = getTemplatesByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    return templates;
  })();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Elige una Plantilla
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {SURVEY_TEMPLATES.length} plantillas SaaS listas para usar
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <div className="flex gap-2">
            <CategoryTab
              active={selectedCategory === "recommended"}
              onClick={() => setSelectedCategory("recommended")}
              icon="⭐"
              label="Recomendados"
            />
            <CategoryTab
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              icon="📚"
              label="Todos"
            />
            {(Object.keys(CATEGORY_METADATA) as TemplateCategory[]).map((cat) => (
              <CategoryTab
                key={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                icon={CATEGORY_METADATA[cat].icon}
                label={CATEGORY_METADATA[cat].name}
              />
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No se encontraron plantillas</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => onSelect(template)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <p className="text-xs text-slate-500">
            Todas las plantillas son personalizables después de seleccionarlas
          </p>
        </div>
      </div>
    </div>
  );
}

function CategoryTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
      }`}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </button>
  );
}

function TemplateCard({
  template,
  onSelect,
}: {
  template: SurveyTemplate;
  onSelect: () => void;
}) {
  const priorityColors = {
    "must-have": "bg-green-50 text-green-700 border-green-200",
    "should-have": "bg-blue-50 text-blue-700 border-blue-200",
    "nice-to-have": "bg-slate-50 text-slate-700 border-slate-200",
  };

  const priorityLabels = {
    "must-have": "Esencial",
    "should-have": "Recomendado",
    "nice-to-have": "Opcional",
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{template.icon}</div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-md border ${
            priorityColors[template.priority]
          }`}
        >
          {priorityLabels[template.priority]}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {template.name}
      </h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {template.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{template.estimatedTime}</span>
        </div>
        <div>{template.questions.length} preguntas</div>
      </div>

      {/* Recommended Badge */}
      {template.recommended && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
            <Sparkles className="w-3.5 h-3.5" />
            Más usado
          </span>
        </div>
      )}
    </div>
  );
}
