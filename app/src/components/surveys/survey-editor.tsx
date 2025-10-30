"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical, Eye, Save, Loader2, Sparkles } from "lucide-react";
import { nanoid } from "nanoid";

type QuestionType = "multiple_choice" | "rating" | "open_text";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  order: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface SurveyEditorProps {
  surveyId?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialStatus?: "draft" | "active" | "paused" | "archived";
  initialQuestions?: Question[];
  mode: "create" | "edit";
}

export function SurveyEditor({
  surveyId,
  initialTitle = "",
  initialDescription = "",
  initialStatus = "draft",
  initialQuestions = [],
  mode,
}: SurveyEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.map((q, i) => ({ ...q, order: i }))
  );
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: nanoid(),
      type,
      text: "",
      options: type === "multiple_choice" ? ["Opción 1", "Opción 2"] : undefined,
      order: questions.length,
      isNew: mode === "edit",
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    if (mode === "edit") {
      // Mark as deleted instead of removing
      setQuestions(
        questions.map((q) => (q.id === id ? { ...q, isDeleted: true } : q))
      );
    } else {
      // Remove from array
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: [...q.options, `Opción ${q.options.length + 1}`] }
          : q
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    );
  };

  const handleSave = async (saveStatus: typeof status) => {
    if (!title.trim()) {
      alert("Por favor ingresa un título para la encuesta");
      return;
    }

    const activeQuestions = questions.filter((q) => !q.isDeleted);
    if (activeQuestions.length === 0) {
      alert("Agrega al menos una pregunta");
      return;
    }

    setSaving(true);

    try {
      const url = mode === "create" ? "/api/surveys" : `/api/surveys/${surveyId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status: saveStatus,
          questions: questions.map((q, i) => ({ ...q, order: i })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar");
      }

      const data = await response.json();

      if (mode === "create") {
        router.push(`/surveys/${data.survey.id}/edit`);
      } else {
        router.push("/surveys");
      }
    } catch (error: any) {
      alert(error.message || "Error al guardar la encuesta");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta encuesta? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");

      router.push("/surveys");
    } catch (error) {
      alert("Error al eliminar la encuesta");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const activeQuestions = questions.filter((q) => !q.isDeleted);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {mode === "create" ? "Nueva Encuesta" : "Editar Encuesta"}
          </h1>
          <p className="mt-2 text-slate-600">
            {mode === "create"
              ? "Crea una encuesta conversacional para WhatsApp"
              : "Actualiza tu encuesta"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold border border-red-200"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Eliminar
            </button>
          )}

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-2 font-semibold"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Editar" : "Vista Previa"}
          </button>

          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 font-semibold"
          >
            Guardar Borrador
          </button>

          <button
            onClick={() => handleSave("active")}
            disabled={saving}
            className="px-5 py-2.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Publicar" : "Guardar"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <SurveyPreview
          title={title}
          description={description}
          questions={activeQuestions}
        />
      ) : (
        <>
          {/* Survey Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título de la encuesta *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Encuesta de Satisfacción Post-Compra"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el propósito de esta encuesta..."
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {mode === "edit" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="draft">Borrador</option>
                  <option value="active">Activa</option>
                  <option value="paused">Pausada</option>
                  <option value="archived">Archivada</option>
                </select>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {activeQuestions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
                addOption={addOption}
                updateOption={updateOption}
                deleteOption={deleteOption}
              />
            ))}
          </div>

          {/* Add Question Buttons */}
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-700 mb-4">
              Agregar pregunta:
            </p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => addQuestion("multiple_choice")}
                className="p-5 text-left border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <div className="font-semibold text-slate-900 mb-1.5">
                  Opción Múltiple
                </div>
                <div className="text-sm text-slate-500">
                  El usuario elige una opción
                </div>
              </button>

              <button
                onClick={() => addQuestion("rating")}
                className="p-5 text-left border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <div className="font-semibold text-slate-900 mb-1.5">
                  Calificación
                </div>
                <div className="text-sm text-slate-500">Escala del 1 al 10</div>
              </button>

              <button
                onClick={() => addQuestion("open_text")}
                className="p-5 text-left border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <div className="font-semibold text-slate-900 mb-1.5">
                  Texto Abierto
                </div>
                <div className="text-sm text-slate-500">Respuesta libre</div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuestionEditor({
  question,
  index,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
}: {
  question: Question;
  index: number;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addOption: (questionId: string) => void;
  updateOption: (questionId: string, optionIndex: number, value: string) => void;
  deleteOption: (questionId: string, optionIndex: number) => void;
}) {
  const typeLabels = {
    multiple_choice: "Opción Múltiple",
    rating: "Calificación",
    open_text: "Texto Abierto",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div className="pt-2 cursor-move">
          <GripVertical className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
        </div>

        {/* Question Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">
                Pregunta {index + 1}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                {typeLabels[question.type]}
              </span>
            </div>

            <button
              onClick={() => deleteQuestion(question.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Question Text */}
          <div>
            <input
              type="text"
              value={question.text}
              onChange={(e) =>
                updateQuestion(question.id, { text: e.target.value })
              }
              placeholder="Escribe tu pregunta aquí..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Type-specific content */}
          {question.type === "multiple_choice" && question.options && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Opciones:
              </label>
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      updateOption(question.id, i, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {question.options && question.options.length > 2 && (
                    <button
                      onClick={() => deleteOption(question.id, i)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addOption(question.id)}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mt-2"
              >
                <Plus className="w-4 h-4" />
                Agregar opción
              </button>
            </div>
          )}

          {question.type === "rating" && (
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600">
              El usuario responderá con un número del 1 al 10
            </div>
          )}

          {question.type === "open_text" && (
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600">
              El usuario puede escribir cualquier texto como respuesta
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SurveyPreview({
  title,
  description,
  questions,
}: {
  title: string;
  description: string;
  questions: Question[];
}) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm">
      <div className="max-w-md mx-auto">
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-600">Vista Previa WhatsApp</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {title || "Sin título"}
          </h2>
          {description && <p className="text-slate-600">{description}</p>}
        </div>

        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">
                Agrega preguntas para ver la vista previa
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <div className="font-semibold text-slate-900">
                  {index + 1}. {question.text || "Sin texto"}
                </div>

                {question.type === "multiple_choice" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <div
                        key={i}
                        className="px-4 py-2.5 border-2 border-slate-200 rounded-md text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "rating" && (
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <div
                        key={num}
                        className="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-md text-slate-700 font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "open_text" && (
                  <div className="px-4 py-3 border-2 border-slate-200 rounded-md text-slate-400 bg-white">
                    El usuario escribirá su respuesta aquí...
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
