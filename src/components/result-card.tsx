'use client';

import { useState, useCallback } from 'react';
import { QrModal } from './qr-modal';

interface ResultCardProps {
  shortUrl: string;
  code: string;
  originalUrl: string;
  onReset: () => void;
}

export function ResultCard({ shortUrl, code, originalUrl, onReset }: ResultCardProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [showQr, setShowQr] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      // Fallback: select text
      const input = document.createElement('input');
      input.value = shortUrl;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 2000);
      } catch {
        // Ultimate fallback
        prompt('Copy this link:', shortUrl);
      }
      document.body.removeChild(input);
    }
  }, [shortUrl]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SnapLink',
          text: 'Check out this link',
          url: shortUrl,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopy();
    }
  }, [shortUrl, handleCopy]);

  const handleOpen = useCallback(() => {
    window.open(shortUrl, '_blank', 'noopener,noreferrer');
  }, [shortUrl]);

  const truncateUrl = (url: string, maxLen: number = 60) => {
    if (url.length <= maxLen) return url;
    return url.substring(0, maxLen - 3) + '…';
  };

  return (
    <>
      <div className="card-premium relative overflow-hidden">
        {/* Success glow effect */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, var(--color-success-bg), transparent 60%)',
          }}
        />

        <div className="relative">
          {/* Success header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success-500/10 animate-scale-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success-500">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-medium text-success-500">Link created</span>
          </div>

          {/* Short URL */}
          <div className="mb-1">
            <p className="text-tiny font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
              Your short link
            </p>
            <p
              className="text-xl sm:text-2xl font-semibold tracking-tight break-all"
              style={{ color: 'var(--color-text)' }}
            >
              {shortUrl.replace(/^https?:\/\//, '')}
            </p>
          </div>

          {/* Original URL */}
          <p
            className="text-sm mt-2 mb-5 break-all"
            style={{ color: 'var(--color-text-tertiary)' }}
            title={originalUrl}
          >
            {truncateUrl(originalUrl)}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-medium transition-all duration-200 ${
                copyState === 'copied'
                  ? 'bg-success-500 text-white scale-[1.02]'
                  : 'btn-primary !py-2.5'
              }`}
              style={
                copyState === 'copied'
                  ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }
                  : undefined
              }
            >
              {copyState === 'copied' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-check">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>

            <button onClick={handleOpen} className="btn-secondary flex items-center gap-2 !py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Open
            </button>

            <button onClick={() => setShowQr(true)} className="btn-secondary flex items-center gap-2 !py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="3" height="3" />
                <path d="M21 14h-3M21 21h-3v-3" />
              </svg>
              QR
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button onClick={handleShare} className="btn-secondary flex items-center gap-2 !py-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
                Share
              </button>
            )}
          </div>

          {/* Shorten another */}
          <button
            onClick={onReset}
            className="mt-4 text-sm transition-colors duration-150 flex items-center gap-1.5"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Shorten another link
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {showQr && (
        <QrModal
          url={shortUrl}
          code={code}
          onClose={() => setShowQr(false)}
        />
      )}
    </>
  );
}
