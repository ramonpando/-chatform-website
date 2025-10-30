"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Download } from "lucide-react";
import QRCode from "qrcode";

interface SharePageClientProps {
  url: string;
  label?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  showQR?: boolean;
}

export function SharePageClient({
  url,
  label = "Copiado",
  buttonText = "Copiar",
  icon,
  showQR = false,
}: SharePageClientProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Generate QR code
  useEffect(() => {
    if (showQR) {
      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#0F172A", // slate-900
          light: "#FFFFFF",
        },
      })
        .then((dataUrl) => {
          setQrDataUrl(dataUrl);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [url, showQR]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "chatform-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showQR) {
    return (
      <div className="space-y-4">
        {/* QR Code Image */}
        {qrDataUrl ? (
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-slate-100 rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownloadQR}
          disabled={!qrDataUrl}
          className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar QR Code
        </button>

        {/* Copy URL below QR */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-600 mb-2">
            URL de la encuesta
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  {label}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular copy button (no QR)
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={url}
        readOnly
        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
      />
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold whitespace-nowrap"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {label}
          </>
        ) : (
          <>
            {icon || <Copy className="w-4 h-4" />}
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
}
