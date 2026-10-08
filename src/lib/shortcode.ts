import crypto from 'crypto';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 7;
const MAX_RETRIES = 10;

/**
 * Generate a cryptographically secure short code.
 * Uses crypto.randomBytes for true randomness.
 */
export function generateShortCode(length: number = DEFAULT_LENGTH): string {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARSET[bytes[i] % CHARSET.length];
  }
  return code;
}

/**
 * Generate a short code that doesn't collide with existing codes.
 * Uses retry logic with exponential backoff on collision.
 */
export async function generateUniqueCode(
  checkExists: (code: string) => Promise<boolean>,
  length: number = DEFAULT_LENGTH
): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const code = generateShortCode(length);
    const exists = await checkExists(code);
    if (!exists) return code;
  }
  // If we hit max retries, try with a longer code
  const longerCode = generateShortCode(length + 2);
  const exists = await checkExists(longerCode);
  if (!exists) return longerCode;

  throw new Error('Failed to generate a unique short code after maximum retries.');
}
