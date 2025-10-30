export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ChatForm",
    "url": "https://chatform.com",
    "logo": "https://chatform.com/logo.png",
    "description": "Plataforma de encuestas conversacionales por WhatsApp con análisis automático de IA",
    "foundingDate": "2025",
    "sameAs": [
      "https://twitter.com/chatform",
      "https://linkedin.com/company/chatform",
      "https://github.com/chatform"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hola@chatform.com",
      "contactType": "Customer Support",
      "availableLanguage": ["Spanish", "English"]
    }
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChatForm",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Plan",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Hasta 100 respuestas/mes"
      },
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "price": "19",
        "priceCurrency": "USD",
        "description": "Hasta 1,000 respuestas/mes"
      },
      {
        "@type": "Offer",
        "name": "Pro Plan",
        "price": "49",
        "priceCurrency": "USD",
        "description": "Hasta 5,000 respuestas/mes"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "description": "Crea encuestas conversacionales, envíalas por WhatsApp y obtén análisis automático con IA. 50-80% de tasa de respuesta.",
    "featureList": [
      "Encuestas conversacionales por WhatsApp",
      "Análisis automático con IA (NPS, CSAT, Sentiment)",
      "Dashboard con insights en tiempo real",
      "Form builder sin código",
      "Lógica condicional",
      "Integraciones con Zapier, Google Sheets, HubSpot"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ChatForm",
    "url": "https://chatform.com",
    "description": "El Typeform de WhatsApp - Encuestas conversacionales con análisis IA",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://chatform.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cómo funciona ChatForm con WhatsApp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ChatForm se conecta con WhatsApp Business API oficial. Tú creas la encuesta en nuestro builder, y nosotros la enviamos como mensajes conversacionales a tus contactos. Ellos responden naturalmente por WhatsApp, y toda la data se sincroniza automáticamente con tu dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto cuesta enviar mensajes por WhatsApp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meta cobra por conversaciones iniciadas. El costo varía por país, pero típicamente es $0.005-0.015 USD por conversación. Nosotros NO añadimos markup sobre esto. En el plan Free, incluimos créditos para que pruebes sin costos adicionales."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué tipo de análisis hace la IA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nuestra IA analiza automáticamente: (1) NPS scores y categorización, (2) CSAT y satisfacción general, (3) Sentiment analysis (positivo/negativo/neutral), (4) Topics y temas recurrentes, (5) Keywords más mencionados. Todo esto en menos de 30 segundos después de recibir respuestas."
        }
      },
      {
        "@type": "Question",
        "name": "¿Los datos están seguros?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutamente. Usamos WhatsApp Business API oficial que tiene end-to-end encryption, toda la data está encriptada en reposo, cumplimos GDPR y CCPA, nunca compartimos tus datos con terceros, y tienes control total para exportar o eliminar data cuando quieras."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
