"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Save, Loader2, GripVertical } from "lucide-react";
import { nanoid } from "nanoid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Types
export type QuestionType = "email" | "multiple_choice" | "rating" | "open_text" | "yes_no";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  required: boolean;
  validateEmail?: boolean;
  order: number;
}

interface FormBuilderV2Props {
  surveyId?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialWelcomeMessage?: string;
  initialThankYouMessage?: string;
  initialQuestions?: Question[];
  initialStatus?: "draft" | "active" | "paused" | "archived";
  mode: "create" | "edit";
  customizationButton?: React.ReactNode;
}

export function FormBuilderV2({
  surveyId,
  initialTitle = "",
  initialDescription = "",
  initialWelcomeMessage = "¡Hola! Gracias por tu tiempo. Tus respuestas nos ayudan a mejorar.",
  initialThankYouMessage = "¡Gracias por completar la encuesta! Tu opinión es muy valiosa para nosotros.",
  initialQuestions = [],
  initialStatus = "draft",
  mode,
  customizationButton,
}: FormBuilderV2Props) {
  const router = useRouter();

  // State
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [welcomeMessage, setWelcomeMessage] = useState(initialWelcomeMessage);
  const [thankYouMessage, setThankYouMessage] = useState(initialThankYouMessage);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedItem, setSelectedItem] = useState<"welcome" | "thankyou" | string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"draft" | "active" | "paused" | "archived">(
    mode === "create" ? "active" : initialStatus
  );

  // Handlers
  const addQuestion = (type: QuestionType) => {
    const defaultOptions =
      type === "multiple_choice"
        ? ["Opción 1", "Opción 2"]
        : type === "yes_no"
        ? ["Sí", "No"]
        : undefined;

    const newQuestion: Question = {
      id: nanoid(),
      type,
      text: "",
      options: defaultOptions,
      required: true,
      validateEmail: type === "email" ? true : undefined,
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
    setSelectedItem(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, index) => ({ ...q, order: index }))
    );
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Por favor ingresa un título para la encuesta");
      return;
    }

    if (questions.length === 0) {
      alert("Agrega al menos una pregunta");
      return;
    }

    setSaving(true);

    try {
      const url = mode === "create" ? "/api/surveys" : `/api/surveys/${surveyId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const normalizedQuestions = questions.map((question, index) => {
        const base: Partial<Question> & {
          id: string;
          type: QuestionType;
          text: string;
          order: number;
          required: boolean;
        } = {
          id: question.id,
          type: question.type,
          text: question.text,
          order: index,
          required: question.required,
        };

        if (question.type === "multiple_choice") {
          base.options =
            question.options && question.options.length > 0
              ? question.options
              : ["Opción 1", "Opción 2"];
        } else if (question.type === "yes_no") {
          base.options =
            question.options && question.options.length === 2
              ? question.options
              : ["Sí", "No"];
        } else if (question.type === "email") {
          base.validateEmail =
            question.validateEmail !== undefined ? question.validateEmail : true;
        }

        return base;
      });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          welcomeMessage,
          thankYouMessage,
          status,
          questions: normalizedQuestions,
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

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la encuesta"
              className="text-lg font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {customizationButton}

          {mode === "edit" ? (
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "active" | "paused" | "archived")
              }
              className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700"
            >
              <option value="draft">Borrador</option>
              <option value="active">Activa</option>
              <option value="paused">Pausada</option>
              <option value="archived">Archivada</option>
            </select>
          ) : (
            <span className="px-3 py-2 text-xs font-semibold uppercase rounded-md bg-green-50 text-green-600 border border-green-200">
              Publicada
            </span>
          )}

          <button
            onClick={() => router.push("/surveys")}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium text-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Publicar" : "Guardar"}
          </button>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Structure Panel */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <StructurePanel
            questions={questions}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onAddQuestion={addQuestion}
            onDeleteQuestion={deleteQuestion}
          />
        </DndContext>

        {/* Center: Preview Panel */}
        <PreviewPanel
          title={title}
          welcomeMessage={welcomeMessage}
          questions={questions}
          thankYouMessage={thankYouMessage}
        />

        {/* Right: Properties Panel */}
        <PropertiesPanel
          selectedItem={selectedItem}
          questions={questions}
          welcomeMessage={welcomeMessage}
          thankYouMessage={thankYouMessage}
          onUpdateQuestion={updateQuestion}
          onUpdateWelcomeMessage={setWelcomeMessage}
          onUpdateThankYouMessage={setThankYouMessage}
        />
      </div>
    </div>
  );
}

// Structure Panel Component (Left)
function StructurePanel({
  questions,
  selectedItem,
  onSelectItem,
  onAddQuestion,
  onDeleteQuestion,
}: {
  questions: Question[];
  selectedItem: string | null;
  onSelectItem: (id: string | null) => void;
  onAddQuestion: (type: QuestionType) => void;
  onDeleteQuestion: (id: string) => void;
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="w-[270px] border-r border-slate-200 bg-white flex flex-col">
      {/* AI Quick Action */}
      <div className="p-4 border-b border-slate-200">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium text-sm">
          <Sparkles className="w-4 h-4" />
          Generar con IA
        </button>
      </div>

      {/* Survey Flow */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Welcome Section */}
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Inicio
        </div>
        <button
          onClick={() => onSelectItem("welcome")}
          className={`w-full text-left p-3 rounded-lg border mb-4 transition-all ${
            selectedItem === "welcome"
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="font-medium text-sm text-slate-900">Mensaje de Bienvenida</div>
          <div className="text-xs text-slate-500 mt-0.5">Saludo inicial</div>
        </button>

        {/* Questions */}
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Preguntas ({questions.length})
        </div>
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 mb-4">
            {questions.map((question, index) => (
              <SortableQuestionCard
                key={question.id}
                question={question}
                index={index}
                isSelected={selectedItem === question.id}
                onSelect={() => onSelectItem(question.id)}
                onDelete={() => onDeleteQuestion(question.id)}
              />
            ))}
          </div>
        </SortableContext>

        {/* Add Question Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Agregar Pregunta
          </button>

          {/* Dropdown Menu */}
          {showAddMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => {
                  onAddQuestion("email");
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium text-sm text-slate-900">Email</div>
                <div className="text-xs text-slate-500">Con validación automática</div>
              </button>
              <button
                onClick={() => {
                  onAddQuestion("multiple_choice");
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <div className="font-medium text-sm text-slate-900">Opción Múltiple</div>
                <div className="text-xs text-slate-500">Usuario elige una opción</div>
              </button>
              <button
                onClick={() => {
                  onAddQuestion("rating");
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <div className="font-medium text-sm text-slate-900">Calificación</div>
                <div className="text-xs text-slate-500">Escala del 1 al 10</div>
              </button>
              <button
                onClick={() => {
                  onAddQuestion("yes_no");
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <div className="font-medium text-sm text-slate-900">Sí/No</div>
                <div className="text-xs text-slate-500">Respuesta binaria</div>
              </button>
              <button
                onClick={() => {
                  onAddQuestion("open_text");
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                <div className="font-medium text-sm text-slate-900">Texto Abierto</div>
                <div className="text-xs text-slate-500">Respuesta libre</div>
              </button>
            </div>
          )}
        </div>

        {/* Thank You Section */}
        <div className="text-xs font-semibold text-slate-500 mt-6 mb-2 uppercase tracking-wide">
          Final
        </div>
        <button
          onClick={() => onSelectItem("thankyou")}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedItem === "thankyou"
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="font-medium text-sm text-slate-900">Mensaje de Despedida</div>
          <div className="text-xs text-slate-500 mt-0.5">Cierre de la encuesta</div>
        </button>
      </div>
    </div>
  );
}

// Sortable Question Card Component
function SortableQuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onDelete,
}: {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeLabels: Record<QuestionType, string> = {
    email: "Email",
    multiple_choice: "Opción Múltiple",
    rating: "Calificación",
    open_text: "Texto",
    yes_no: "Sí/No",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 mt-0.5"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-1 cursor-pointer" onClick={onSelect}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500">{index + 1}</span>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
              {typeLabels[question.type]}
            </span>
          </div>
          <div className="text-sm text-slate-900 font-medium truncate">
            {question.text || "Nueva pregunta"}
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Panel Component (Center) - Interactive Simulator
function PreviewPanel({
  title,
  welcomeMessage,
  questions,
  thankYouMessage,
}: {
  title: string;
  welcomeMessage: string;
  questions: Question[];
  thankYouMessage: string;
}) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = not started
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [showTyping, setShowTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentQuestionIndex, userResponses, showTyping]);

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentQuestionIndex(0);
    setUserResponses({});
    setInputValue("");
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentQuestionIndex(-1);
    setUserResponses({});
    setInputValue("");
  };

  const handleResponse = (answer: string) => {
    if (currentQuestionIndex >= questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    setUserResponses((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    setInputValue("");

    // Show typing indicator
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Show thank you message
        setCurrentQuestionIndex(questions.length);
      }
    }, 800);
  };

  const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < questions.length
    ? questions[currentQuestionIndex]
    : null;

  const isCompleted = currentQuestionIndex === questions.length;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Vista Previa</h3>
        <div className="flex items-center gap-2">
          {isSimulating && (
            <span className="text-xs text-slate-500">
              {isCompleted ? "Completado" : `${currentQuestionIndex + 1}/${questions.length}`}
            </span>
          )}
          <button
            onClick={isSimulating ? resetSimulation : startSimulation}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              isSimulating
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={questions.length === 0}
          >
            {isSimulating ? "🔄 Reiniciar" : "▶️ Simular"}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <div className="w-[320px] max-h-[520px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              💬
            </div>
            <div>
              <div className="font-medium text-sm">{title || "ChatForm"}</div>
              <div className="text-xs opacity-80">En línea</div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD] space-y-3">
            {!isSimulating ? (
              /* Static Preview Mode */
              <>
                {welcomeMessage && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-slate-900">{welcomeMessage}</p>
                      <span className="text-xs text-slate-500 mt-1 block">14:06</span>
                    </div>
                  </div>
                )}
                {questions.map((question, index) => (
                  <div key={question.id} className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-slate-900 font-medium">
                        {index + 1}. {question.text || "Sin texto"}
                      </p>
                      {question.type !== "email" && question.type !== "open_text" && question.type !== "rating" && question.options && (
                        <div className="mt-2 space-y-1">
                          {question.options.map((opt, i) => (
                            <div key={i} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === "email" && (
                        <p className="mt-2 text-xs text-slate-500">
                          El usuario deberá responder con su correo electrónico.
                        </p>
                      )}
                      <span className="text-xs text-slate-500 mt-1 block">14:06</span>
                    </div>
                  </div>
                ))}
                {thankYouMessage && questions.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-slate-900">{thankYouMessage}</p>
                      <span className="text-xs text-slate-500 mt-1 block">14:06</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Interactive Simulation Mode */
              <>
                {/* Welcome Message */}
                {welcomeMessage && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-slate-900">{welcomeMessage}</p>
                      <span className="text-xs text-slate-500 mt-1 block">
                        {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Show questions up to current index */}
                {questions.slice(0, currentQuestionIndex + 1).map((question, index) => (
                  <React.Fragment key={question.id}>
                    {/* Bot question */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-slate-900 font-medium">
                          {index + 1}. {question.text || "Sin texto"}
                        </p>
                        {question.type !== "email" && question.type !== "open_text" && question.type !== "rating" && question.options && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((opt, i) => (
                              <div key={i} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <span className="text-xs text-slate-500 mt-1 block">
                          {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* User response */}
                    {userResponses[question.id] && (
                      <div className="flex justify-end">
                        <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none shadow px-4 py-3 max-w-[80%]">
                          <p className="text-sm text-slate-900">{userResponses[question.id]}</p>
                          <span className="text-xs text-slate-500 mt-1 block">
                            {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Typing indicator */}
                {showTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Thank you message */}
                {isCompleted && thankYouMessage && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-slate-900">{thankYouMessage}</p>
                      <span className="text-xs text-slate-500 mt-1 block">
                        {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {/* Input Bar - Interactive */}
          <div className="border-t bg-white px-4 py-3">
            {!isSimulating || isCompleted ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Click 'Simular' para probar"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none"
                  disabled
                />
                <button className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center">
                  ▶
                </button>
              </div>
            ) : (
              <>
                {/* Multiple Choice or Yes/No - Show buttons */}
                {currentQuestion && (currentQuestion.type === "multiple_choice" || currentQuestion.type === "yes_no") && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleResponse(option)}
                        className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Rating - Show number buttons */}
                {currentQuestion && currentQuestion.type === "rating" && (
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(10)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleResponse(`${i + 1}`)}
                        className="px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Email or Open Text - Show input */}
                {currentQuestion && (currentQuestion.type === "email" || currentQuestion.type === "open_text") && (
                  <div className="flex items-center gap-2">
                    <input
                      type={currentQuestion.type === "email" ? "email" : "text"}
                      placeholder={currentQuestion.type === "email" ? "tu@email.com" : "Escribe tu respuesta..."}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && inputValue.trim()) {
                          handleResponse(inputValue.trim());
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => inputValue.trim() && handleResponse(inputValue.trim())}
                      disabled={!inputValue.trim()}
                      className="w-10 h-10 rounded-full bg-[#075E54] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ▶
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Properties Panel Component (Right)
function PropertiesPanel({
  selectedItem,
  questions,
  welcomeMessage,
  thankYouMessage,
  onUpdateQuestion,
  onUpdateWelcomeMessage,
  onUpdateThankYouMessage,
}: {
  selectedItem: string | null;
  questions: Question[];
  welcomeMessage: string;
  thankYouMessage: string;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onUpdateWelcomeMessage: (message: string) => void;
  onUpdateThankYouMessage: (message: string) => void;
}) {
  const selectedQuestion = questions.find((q) => q.id === selectedItem);

  if (!selectedItem) {
    return (
      <div className="w-[340px] border-l border-slate-200 bg-white">
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600">
            Selecciona un elemento para editar sus propiedades
          </p>
        </div>
      </div>
    );
  }

  if (selectedItem === "welcome") {
    return (
      <div className="w-[340px] border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Mensaje de Bienvenida</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje</label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => onUpdateWelcomeMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Escribe tu mensaje de bienvenida..."
            />
            <p className="text-xs text-slate-500 mt-2">
              Este mensaje se mostrará al inicio de la encuesta
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedItem === "thankyou") {
    return (
      <div className="w-[340px] border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Mensaje de Despedida</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje</label>
            <textarea
              value={thankYouMessage}
              onChange={(e) => onUpdateThankYouMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Escribe tu mensaje de despedida..."
            />
            <p className="text-xs text-slate-500 mt-2">
              Este mensaje se mostrará al completar la encuesta
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedQuestion) return null;

  return (
    <div className="w-[340px] border-l border-slate-200 bg-white overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Pregunta</label>
          <select
            value={selectedQuestion.type}
            onChange={(e) => {
              const newType = e.target.value as QuestionType;
              const updates: Partial<Question> = { type: newType };

              if (newType === "multiple_choice") {
                updates.options =
                  selectedQuestion.options && selectedQuestion.options.length > 0
                    ? selectedQuestion.options
                    : ["Opción 1", "Opción 2"];
                updates.validateEmail = undefined;
              } else if (newType === "yes_no") {
                updates.options = ["Sí", "No"];
                updates.validateEmail = undefined;
              } else if (newType === "email") {
                updates.options = undefined;
                updates.validateEmail = selectedQuestion.validateEmail ?? true;
              } else {
                updates.options = undefined;
                updates.validateEmail = undefined;
              }

              onUpdateQuestion(selectedQuestion.id, updates);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="email">Email</option>
            <option value="multiple_choice">Opción Múltiple</option>
            <option value="rating">Calificación</option>
            <option value="yes_no">Sí/No</option>
            <option value="open_text">Texto Abierto</option>
          </select>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Pregunta</label>
          <textarea
            value={selectedQuestion.text}
            onChange={(e) => onUpdateQuestion(selectedQuestion.id, { text: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="¿Qué quieres preguntar?"
          />
        </div>

        {/* Options for Multiple Choice */}
        {(selectedQuestion.type === "multiple_choice" || selectedQuestion.type === "yes_no") && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Opciones</label>
            <div className="space-y-2">
              {selectedQuestion.options?.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...(selectedQuestion.options || [])];
                    newOptions[i] = e.target.value;
                    onUpdateQuestion(selectedQuestion.id, { options: newOptions });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400"
                />
              ))}
              {selectedQuestion.type === "multiple_choice" && (
                <button
                  onClick={() => {
                    const newOptions = [
                      ...(selectedQuestion.options || []),
                      `Opción ${(selectedQuestion.options?.length || 0) + 1}`,
                    ];
                    onUpdateQuestion(selectedQuestion.id, { options: newOptions });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Agregar opción
                </button>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedQuestion.required}
              onChange={(e) =>
                onUpdateQuestion(selectedQuestion.id, { required: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-slate-700">Campo requerido</span>
          </label>
        </div>

        {selectedQuestion.type === "email" && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedQuestion.validateEmail ?? true}
                onChange={(e) =>
                  onUpdateQuestion(selectedQuestion.id, { validateEmail: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Validar formato de email</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
