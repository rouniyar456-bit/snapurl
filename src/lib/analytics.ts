/**
 * Parse user-agent string into device, browser, and OS info.
 * Lightweight implementation that avoids heavy dependencies.
 */
export function parseUserAgent(ua: string | null): {
  device: string;
  browser: string;
  os: string;
} {
  if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

  const device = detectDevice(ua);
  const browser = detectBrowser(ua);
  const os = detectOS(ua);

  return { device, browser, os };
}

function detectDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    if (/tablet|ipad/i.test(ua)) return 'Tablet';
    return 'Mobile';
  }
  return 'Desktop';
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return 'Opera';
  if (/brave/i.test(ua)) return 'Brave';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/msie|trident/i.test(ua)) return 'IE';
  return 'Other';
}

function detectOS(ua: string): string {
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua) && !/android/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/chromeos/i.test(ua)) return 'ChromeOS';
  return 'Other';
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}
