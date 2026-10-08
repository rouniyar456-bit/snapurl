'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ResultCard } from './result-card';

type ShortenState = 'idle' | 'loading' | 'success' | 'error';

interface ShortenResult {
  shortUrl: string;
  code: string;
  originalUrl: string;
}

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [aliasError, setAliasError] = useState('');
  const [state, setState] = useState<ShortenState>('idle');
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState('');
  const [validUrl, setValidUrl] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aliasDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Client-side URL validation
  const validateUrlClient = useCallback((input: string): boolean => {
    if (!input.trim()) return false;
    let test = input.trim();
    if (!/^https?:\/\//i.test(test)) test = `https://${test}`;
    try {
      const parsed = new URL(test);
      return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.includes('.');
    } catch {
      return false;
    }
  }, []);

  // Validate on input change
  useEffect(() => {
    if (!url.trim()) {
      setValidUrl(null);
      return;
    }
    setValidUrl(validateUrlClient(url));
  }, [url, validateUrlClient]);

  // Debounced alias availability check
  useEffect(() => {
    if (!customAlias.trim()) {
      setAliasStatus('idle');
      setAliasError('');
      return;
    }

    setAliasStatus('checking');
    if (aliasDebounceRef.current) clearTimeout(aliasDebounceRef.current);

    aliasDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/alias/check?alias=${encodeURIComponent(customAlias)}`);
        const data = await res.json();
        if (data.available) {
          setAliasStatus('available');
          setAliasError('');
        } else {
          setAliasStatus(data.error?.includes('reserved') || data.error?.includes('taken') ? 'taken' : 'invalid');
          setAliasError(data.error || 'Not available.');
        }
      } catch {
        setAliasStatus('idle');
      }
    }, 400);

    return () => {
      if (aliasDebounceRef.current) clearTimeout(aliasDebounceRef.current);
    };
  }, [customAlias]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Paste a URL to get started.');
      return;
    }

    if (!validateUrlClient(trimmed)) {
      setError("Hmm, that doesn't look like a valid URL.");
      return;
    }

    if (showCustomize && customAlias && aliasStatus !== 'available') {
      setError('Please choose an available alias.');
      return;
    }

    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: trimmed,
          ...(showCustomize && customAlias ? { customAlias } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setState('error');
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      const dynamicShortUrl = `${window.location.origin}/${data.code}`;

      setState('success');
      setResult({
        shortUrl: dynamicShortUrl,
        code: data.code,
        originalUrl: data.originalUrl,
      });

      // Save to local history
      try {
        const history = JSON.parse(localStorage.getItem('snaplink-history') || '[]');
        history.unshift({
          shortUrl: dynamicShortUrl,
          code: data.code,
          originalUrl: data.originalUrl,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('snaplink-history', JSON.stringify(history.slice(0, 20)));
      } catch {
        // Silently fail localStorage
      }
    } catch {
      setState('error');
      setError('Something went wrong. Please try again.');
    }
  };

  const handleReset = () => {
    setUrl('');
    setCustomAlias('');
    setResult(null);
    setState('idle');
    setError('');
    setValidUrl(null);
    setShowCustomize(false);
    inputRef.current?.focus();
  };

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Main input row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                  if (state === 'error') setState('idle');
                }}
                onPaste={() => {
                  // Auto-validate on paste
                  setTimeout(() => {
                    if (inputRef.current) {
                      const val = inputRef.current.value.trim();
                      if (validateUrlClient(val)) setValidUrl(true);
                    }
                  }, 10);
                }}
                placeholder="Paste your long URL here…"
                className="input-premium pr-12"
                aria-label="URL to shorten"
                aria-describedby={error ? 'url-error' : undefined}
                autoComplete="url"
                spellCheck={false}
                disabled={state === 'loading'}
              />
              {/* Valid indicator */}
              {validUrl === true && url.trim() && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success-500">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              {validUrl === false && url.trim() && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-danger-400">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={state === 'loading' || !url.trim()}
              className="btn-primary whitespace-nowrap flex items-center justify-center gap-2 min-w-[140px]"
            >
              {state === 'loading' ? (
                <>
                  <span className="spinner" />
                  <span>Shortening…</span>
                </>
              ) : (
                'Shorten URL'
              )}
            </button>
          </div>

          {/* Custom alias toggle */}
          {state !== 'success' && (
            <div className="mt-3">
              {!showCustomize ? (
                <button
                  type="button"
                  onClick={() => setShowCustomize(true)}
                  className="text-sm transition-colors duration-150 flex items-center gap-1.5"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Customize alias
                </button>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {appDomain}/
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                        placeholder="my-custom-link"
                        className="input-premium !py-2.5 !text-sm !pr-10"
                        maxLength={32}
                      />
                      {aliasStatus === 'checking' && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="spinner !w-3.5 !h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
                        </span>
                      )}
                      {aliasStatus === 'available' && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-scale-in text-success-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                      {(aliasStatus === 'taken' || aliasStatus === 'invalid') && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-scale-in text-danger-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomize(false);
                        setCustomAlias('');
                        setAliasStatus('idle');
                      }}
                      className="btn-ghost !p-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {aliasError && (
                    <p className="text-tiny mt-1.5 ml-1" style={{ color: 'var(--color-danger)' }}>
                      {aliasError}
                    </p>
                  )}
                  {aliasStatus === 'available' && (
                    <p className="text-tiny mt-1.5 ml-1 text-success-500">
                      ✓ Available
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id="url-error"
            role="alert"
            className="mt-3 text-sm animate-fade-in flex items-center gap-2"
            style={{ color: 'var(--color-danger)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </p>
        )}
      </form>

      {/* Result Card */}
      {state === 'success' && result && (
        <div className="mt-6 animate-slide-up">
          <ResultCard
            shortUrl={result.shortUrl}
            code={result.code}
            originalUrl={result.originalUrl}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
