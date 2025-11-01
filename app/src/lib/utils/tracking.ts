import { createHash } from 'crypto';
import { headers } from 'next/headers';

/**
 * Lista de user agents conocidos de bots y crawlers
 */
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /WhatsApp/i, // WhatsApp link preview
  /facebookexternalhit/i, // Facebook link preview
  /Twitterbot/i,
  /LinkedInBot/i,
  /Slackbot/i,
  /TelegramBot/i,
  /Googlebot/i,
  /bingbot/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /http/i,
];

/**
 * Detecta si el user agent es de un bot o crawler
 */
export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

/**
 * Obtiene la IP real del cliente considerando proxies (Vercel, Cloudflare, etc.)
 */
export async function getClientIP(): Promise<string | null> {
  const headersList = await headers();

  // Vercel forwarded IP
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for puede contener múltiples IPs separadas por comas
    // La primera es la IP del cliente original
    return forwardedFor.split(',')[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = headersList.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // Otras opciones
  const realIP = headersList.get('x-real-ip');
  if (realIP) return realIP;

  return null;
}

/**
 * Genera un fingerprint único basado en IP + User Agent
 * Esto ayuda a identificar usuarios únicos sin usar cookies
 */
export function generateFingerprint(ip: string | null, userAgent: string | null): string {
  const data = `${ip || 'unknown'}-${userAgent || 'unknown'}`;
  return createHash('sha256').update(data).digest('hex').slice(0, 64);
}

/**
 * Obtiene información completa del visitante para tracking
 */
export async function getVisitorInfo() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const ip = await getClientIP();
  const referrer = headersList.get('referer');

  return {
    ip,
    userAgent,
    referrer,
    fingerprint: generateFingerprint(ip, userAgent),
    isBot: isBot(userAgent),
  };
}
