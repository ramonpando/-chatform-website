"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, MessageCircle, Sparkles, AlertCircle } from "lucide-react";
import { nanoid } from "nanoid";
import type { Question } from "./form-builder-v2";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIConversationalBuilderProps {
  onClose: () => void;
  onApplySurvey: (survey: {
    title: string;
    questions: Question[];
    welcomeMessage?: string;
    thankYouMessage?: string;
  }) => void;
  currentDraft?: {
    title: string;
    questions: Question[];
    welcomeMessage?: string;
    thankYouMessage?: string;
  };
}

export function AIConversationalBuilder({
  onClose,
  onApplySurvey,
  currentDraft,
}: AIConversationalBuilderProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: "ai",
      content: "¡Hola! Voy a ayudarte a crear tu encuesta. ¿Qué tipo de feedback quieres recopilar?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => nanoid());
  const [messagesRemaining, setMessagesRemaining] = useState(20);
  const [workingDraft, setWorkingDraft] = useState(currentDraft || {
    title: "",
    questions: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/survey-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          currentDraft: workingDraft,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar mensaje");
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: nanoid(),
        role: "ai",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setMessagesRemaining(data.messagesRemaining);

      // Handle actions
      if (data.action) {
        handleAIAction(data.action);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIAction = (action: any) => {
    switch (action.type) {
      case "add_question":
        setWorkingDraft((prev) => ({
          ...prev,
          questions: [
            ...prev.questions,
            {
              id: nanoid(),
              ...action.question,
            } as Question,
          ],
        }));
        break;

      case "modify_question":
        setWorkingDraft((prev) => ({
          ...prev,
          questions: prev.questions.map((q, i) =>
            i === action.questionIndex
              ? { ...q, ...action.updates }
              : q
          ),
        }));
        break;

      case "delete_question":
        setWorkingDraft((prev) => ({
          ...prev,
          questions: prev.questions.filter((_, i) => i !== action.questionIndex),
        }));
        break;

      case "generate_draft":
        // Handle full draft generation
        break;
    }
  };

  const handleApply = () => {
    if (workingDraft.questions.length === 0) {
      setError("Agrega al menos una pregunta antes de aplicar");
      return;
    }

    onApplySurvey(workingDraft);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  AI Survey Assistant
                </h2>
                <p className="text-sm text-slate-600">
                  {messagesRemaining} mensajes restantes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Draft Preview */}
        {workingDraft.questions.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">
                  Borrador: {workingDraft.questions.length} pregunta{workingDraft.questions.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={handleApply}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Aplicar Encuesta
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-900 shadow-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap font-medium text-slate-900">{message.content}</p>
                <span
                  className={`text-xs mt-1 block ${
                    message.role === "user"
                      ? "text-blue-100"
                      : "text-slate-700"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-100">
            <div className="flex items-center gap-2 text-sm text-red-900">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading || messagesRemaining <= 0}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed bg-white text-slate-900 placeholder:text-slate-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || messagesRemaining <= 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Enviar
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-slate-500">
              Presiona Enter para enviar • Shift + Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
