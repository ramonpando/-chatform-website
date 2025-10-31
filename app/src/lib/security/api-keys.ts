import { createHash, timingSafeEqual } from "crypto";

/**
 * Hashes an API key using SHA-256. Store only the hash in the database.
 */
export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

/**
 * Generates a short prefix that can be stored alongside the hash for display/logging.
 */
export function getApiKeyPrefix(rawKey: string, length = 10): string {
  return rawKey.slice(0, length);
}

/**
 * Performs a timing-safe comparison between an incoming API key and the stored hash.
 */
export function verifyApiKey(rawKey: string, storedHash: string | null): boolean {
  if (!storedHash) {
    return false;
  }

  const providedHash = hashApiKey(rawKey);

  // Both hashes must have the same length before using timingSafeEqual
  const providedBuffer = Buffer.from(providedHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (providedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, storedBuffer);
}
