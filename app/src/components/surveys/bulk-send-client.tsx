"use client";

import { useState, useRef } from "react";
import { Upload, Users, Send, CheckCircle, XCircle, AlertCircle, Download, Loader2 } from "lucide-react";

interface Contact {
  phone: string;
  name?: string;
}

interface BulkSendResult {
  phone: string;
  name?: string;
  status: "success" | "error";
  message?: string;
}

interface BulkSendClientProps {
  surveyId: string;
  surveyTitle: string;
  questionCount: number;
  creditsAvailable: number;
  hasApiKey: boolean;
  apiKeyPrefix?: string;
}

export function BulkSendClient({
  surveyId,
  surveyTitle,
  questionCount,
  creditsAvailable,
  hasApiKey,
  apiKeyPrefix,
}: BulkSendClientProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [results, setResults] = useState<BulkSendResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse CSV
  const parseCSV = (text: string): Contact[] => {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return [];

    // Detectar si tiene headers
    const hasHeaders = lines[0].toLowerCase().includes("phone") || lines[0].toLowerCase().includes("tel");
    const dataLines = hasHeaders ? lines.slice(1) : lines;

    const parsed: Contact[] = [];

    for (const line of dataLines) {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length === 0 || !parts[0]) continue;

      const phone = parts[0].replace(/[^+\d]/g, ""); // Clean phone
      const name = parts[1] || undefined;

      // Validate phone (E.164 format)
      if (/^\+\d{10,15}$/.test(phone)) {
        parsed.push({ phone, name });
      }
    }

    return parsed;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);

        if (parsed.length === 0) {
          setError("No se encontraron números válidos en el CSV");
          return;
        }

        setContacts(parsed);
        setResults([]);
      } catch (err) {
        setError("Error al leer el archivo CSV");
      }
    };

    reader.readAsText(file);
  };

  // Send to all contacts
  const handleSendAll = async () => {
    if (contacts.length === 0) {
      setError("No hay contactos para enviar");
      return;
    }

    if (!hasApiKey) {
      setError("Necesitas generar una API key en Settings → API");
      return;
    }

    if (contacts.length > creditsAvailable) {
      setError(`No tienes suficientes créditos. Tienes ${creditsAvailable}, necesitas ${contacts.length}`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults([]);
    setProgress({ current: 0, total: contacts.length });

    const newResults: BulkSendResult[] = [];

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];

      try {
        // Call the API endpoint (we'll use the internal API, not external)
        const response = await fetch(`/api/surveys/${surveyId}/send-bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: contact.phone,
            name: contact.name,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          newResults.push({
            phone: contact.phone,
            name: contact.name,
            status: "success",
            message: data.deliveryMethod === "automatic" ? "Enviado" : "Link generado",
          });
        } else {
          newResults.push({
            phone: contact.phone,
            name: contact.name,
            status: "error",
            message: data.error || "Error desconocido",
          });
        }
      } catch (err) {
        newResults.push({
          phone: contact.phone,
          name: contact.name,
          status: "error",
          message: "Error de red",
        });
      }

      setResults([...newResults]);
      setProgress({ current: i + 1, total: contacts.length });

      // Rate limiting: 1.1 seconds between requests (60/min)
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1100));
      }
    }

    setIsProcessing(false);
  };

  // Download example CSV
  const downloadExample = () => {
    const csv = `phone,name
"+5215512345678","Juan Pérez"
"+5215587654321","María López"
"+5215523456789","Carlos Rodríguez"
"+5215598765432","Ana García"
"+5215556781234","Pedro Martínez"`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ejemplo-contactos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const successCount = results.filter(r => r.status === "success").length;
  const errorCount = results.filter(r => r.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{creditsAvailable.toLocaleString()}</div>
          <div className="text-sm text-slate-600 mt-1">Créditos disponibles</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{contacts.length}</div>
          <div className="text-sm text-slate-600 mt-1">Contactos cargados</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{questionCount}</div>
          <div className="text-sm text-slate-600 mt-1">Preguntas</div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">1. Subir CSV</h2>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Sube un archivo CSV con tus contactos. Formato: <code className="px-2 py-0.5 bg-slate-100 rounded text-xs">phone,name</code>
        </p>

        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Seleccionar CSV
          </button>
          <button
            onClick={downloadExample}
            className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Ejemplo
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {contacts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">2. Vista Previa</h2>
          </div>

          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">#</th>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">Teléfono</th>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {contacts.slice(0, 100).map((contact, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2 px-4 text-slate-600">{i + 1}</td>
                    <td className="py-2 px-4 font-mono text-slate-900">{contact.phone}</td>
                    <td className="py-2 px-4 text-slate-600">{contact.name || "-"}</td>
                  </tr>
                ))}
                {contacts.length > 100 && (
                  <tr className="border-t border-slate-100 bg-slate-50">
                    <td colSpan={3} className="py-2 px-4 text-center text-sm text-slate-500">
                      ... y {contacts.length - 100} más
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Send Section */}
      {contacts.length > 0 && !isProcessing && results.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">3. Enviar Encuestas</h2>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Se enviarán {contacts.length} encuestas por WhatsApp. Esto usará {contacts.length} créditos.
          </p>

          <button
            onClick={handleSendAll}
            disabled={!hasApiKey || contacts.length > creditsAvailable}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
          >
            <Send className="w-6 h-6" />
            Enviar a {contacts.length} contactos
          </button>

          {!hasApiKey && (
            <p className="text-sm text-amber-600 mt-3 text-center">
              ⚠️ Necesitas generar una API key en Settings → API
            </p>
          )}
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <h2 className="text-lg font-semibold text-slate-900">Enviando...</h2>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>{progress.current} de {progress.total}</span>
              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            ⏱️ Tiempo estimado: ~{Math.ceil((progress.total - progress.current) * 1.1 / 60)} minutos
          </p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Resultados</h2>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-xs text-green-700">Exitosos</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-xs text-red-700">Errores</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">Estado</th>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">Teléfono</th>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">Nombre</th>
                  <th className="text-left py-2 px-4 font-semibold text-slate-700">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2 px-4">
                      {result.status === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </td>
                    <td className="py-2 px-4 font-mono text-slate-900">{result.phone}</td>
                    <td className="py-2 px-4 text-slate-600">{result.name || "-"}</td>
                    <td className="py-2 px-4 text-sm text-slate-600">{result.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isProcessing && (
            <button
              onClick={() => {
                setContacts([]);
                setResults([]);
                setProgress({ current: 0, total: 0 });
              }}
              className="mt-4 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              Cargar nuevo CSV
            </button>
          )}
        </div>
      )}
    </div>
  );
}
