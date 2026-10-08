import { z } from 'zod';

// ─── URL Validation ───────────────────────────────────

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

const PRIVATE_IP_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
  /^fd/,
];

const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  '0.0.0.0',
  '[::1]',
];

export function isPrivateAddress(hostname: string): boolean {
  if (BLOCKED_HOSTNAMES.includes(hostname.toLowerCase())) return true;
  return PRIVATE_IP_RANGES.some((pattern) => pattern.test(hostname));
}

export function validateUrl(input: string): {
  valid: boolean;
  url?: string;
  error?: string;
} {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Paste a URL to get started.' };
  }

  let trimmed = input.trim();

  // Add protocol if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are supported.' };
    }

    if (!parsed.hostname || parsed.hostname.length < 1) {
      return { valid: false, error: "Hmm, that doesn't look like a valid URL." };
    }

    // Check for private/internal addresses (SSRF protection)
    if (isPrivateAddress(parsed.hostname)) {
      return { valid: false, error: "Hmm, that doesn't look like a valid URL." };
    }

    // Basic domain validation
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return { valid: false, error: "Hmm, that doesn't look like a valid URL." };
    }

    return { valid: true, url: parsed.href };
  } catch {
    return { valid: false, error: "Hmm, that doesn't look like a valid URL." };
  }
}

// ─── Schemas ──────────────────────────────────────────

export const shortenUrlSchema = z.object({
  url: z.string().min(1, 'URL is required').max(2048, 'URL is too long'),
  customAlias: z
    .string()
    .min(3, 'Alias must be at least 3 characters')
    .max(32, 'Alias must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores are allowed')
    .optional(),
});

export const reportSchema = z.object({
  linkId: z.string().min(1),
  reason: z.string().min(1, 'Please select a reason'),
  details: z.string().max(1000).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

// ─── Alias Validation ─────────────────────────────────

export const RESERVED_ROUTES = new Set([
  'api',
  'admin',
  'login',
  'signup',
  'dashboard',
  'settings',
  'help',
  'not-found',
  'about',
  'terms',
  'privacy',
  'pricing',
  'features',
  'report',
  'auth',
  'app',
  'static',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

export function isReservedAlias(alias: string): boolean {
  return RESERVED_ROUTES.has(alias.toLowerCase());
}

export function validateAlias(alias: string): {
  valid: boolean;
  error?: string;
} {
  if (alias.length < 3) {
    return { valid: false, error: 'Alias must be at least 3 characters.' };
  }
  if (alias.length > 32) {
    return { valid: false, error: 'Alias must be at most 32 characters.' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
    return { valid: false, error: 'Only letters, numbers, hyphens, and underscores.' };
  }
  if (isReservedAlias(alias)) {
    return { valid: false, error: 'This alias is reserved.' };
  }
  return { valid: true };
}
