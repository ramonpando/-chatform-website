import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";
import { ChatWidget } from "@/components/chat-widget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ChatForm - Crea encuestas con IA y envíalas por WhatsApp",
    template: "%s | ChatForm"
  },
  description: "La IA crea tu encuesta en segundos. Envíala por WhatsApp y obtén análisis automático. 10x más respuestas que email. Desde $0 - Prueba gratis.",
  keywords: [
    "encuestas whatsapp",
    "chatform",
    "encuestas con ia",
    "ai form builder",
    "typeform whatsapp",
    "nps whatsapp",
    "csat survey",
    "encuestas conversacionales",
    "análisis ia",
    "feedback clientes",
    "whatsapp business api",
    "sentiment analysis",
    "customer feedback",
    "survey tool",
    "encuestas mexico",
    "ai survey generator"
  ],
  authors: [{ name: "ChatForm", url: "https://chatform.com" }],
  creator: "ChatForm",
  publisher: "ChatForm",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://chatform.com",
    siteName: "ChatForm",
    title: "ChatForm - Crea encuestas con IA y envíalas por WhatsApp",
    description: "La IA crea tu encuesta en segundos. Envíala por WhatsApp y obtén análisis automático. 10x más respuestas que email. Gratis 25 respuestas/mes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatForm - Encuestas por WhatsApp con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chatform",
    creator: "@chatform",
    title: "ChatForm - Encuestas con IA por WhatsApp",
    description: "AI genera tu encuesta. 10x más respuestas que email. Gratis 25 respuestas/mes. 🚀",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://chatform.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es-MX": "/",
      "es": "/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
