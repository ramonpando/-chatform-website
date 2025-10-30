import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ChatForm - El Typeform de WhatsApp | Encuestas con IA",
    template: "%s | ChatForm"
  },
  description: "Crea encuestas conversacionales, envíalas por WhatsApp y obtén análisis automático con IA. 50-80% de tasa de respuesta. 5-10x más que email. Gratis hasta 100 respuestas.",
  keywords: [
    "encuestas whatsapp",
    "chatform",
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
    "encuestas mexico"
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
    title: "ChatForm - El Typeform de WhatsApp | Encuestas con IA",
    description: "Crea encuestas conversacionales, envíalas por WhatsApp y obtén análisis automático con IA. 50-80% de tasa de respuesta. Gratis hasta 100 respuestas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChatForm - Encuestas por WhatsApp con análisis IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chatform",
    creator: "@chatform",
    title: "ChatForm - El Typeform de WhatsApp",
    description: "50-80% tasa de respuesta. Análisis automático con IA. Gratis hasta 100 respuestas. 🚀",
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
      </body>
    </html>
  );
}
