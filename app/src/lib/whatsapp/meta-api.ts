// Meta WhatsApp Cloud API integration

export interface MetaSendMessageParams {
  to: string; // Phone number without + (e.g., "5215542317035")
  type: "text" | "template";
  text?: {
    body: string;
    preview_url?: boolean;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

export interface MetaSendMessageResponse {
  messaging_product: "whatsapp";
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

/**
 * Send a WhatsApp message using Meta Cloud API
 */
export async function sendMetaWhatsAppMessage(
  params: MetaSendMessageParams
): Promise<MetaSendMessageResponse> {
  const phoneId = process.env.META_WHATSAPP_PHONE_ID;
  const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !accessToken) {
    throw new Error("Meta WhatsApp credentials not configured");
  }

  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    ...params,
  };

  console.log("[META API] Sending message:", {
    to: params.to,
    type: params.type,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[META API] Error:", error);
    throw new Error(`Meta API error: ${error}`);
  }

  const result = await response.json();
  console.log("[META API] Message sent successfully:", result);

  return result;
}

/**
 * Send a text message
 */
export async function sendTextMessage(to: string, body: string) {
  // Remove + if present
  const cleanPhone = to.replace(/^whatsapp:\+?/, "").replace(/^\+/, "");

  return sendMetaWhatsAppMessage({
    to: cleanPhone,
    type: "text",
    text: {
      body,
      preview_url: false,
    },
  });
}

/**
 * Send a template message (for Business Initiated messages)
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "en_US",
  variables?: string[]
) {
  // Remove + if present
  const cleanPhone = to.replace(/^whatsapp:\+?/, "").replace(/^\+/, "");

  const components = variables && variables.length > 0
    ? [
        {
          type: "body",
          parameters: variables.map(v => ({
            type: "text",
            text: v,
          })),
        },
      ]
    : undefined;

  return sendMetaWhatsAppMessage({
    to: cleanPhone,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components,
    },
  });
}

/**
 * Check if Meta WhatsApp is configured
 */
export function isMetaWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.META_WHATSAPP_PHONE_ID &&
    process.env.META_WHATSAPP_ACCESS_TOKEN
  );
}
