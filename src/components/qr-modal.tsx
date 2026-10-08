'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QrModalProps {
  url: string;
  code: string;
  onClose: () => void;
}

export function QrModal({ url, code, onClose }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#09090b',
          light: '#ffffff',
        },
      }).then(() => setReady(true));
    }
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `snaplink-${code}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative card-premium max-w-sm w-full animate-slide-up text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-title" style={{ color: 'var(--color-text)' }}>QR Code</h3>
          <button onClick={onClose} className="btn-ghost !p-2" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-xl bg-white">
            <canvas ref={canvasRef} className={`transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>

        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
          {url.replace(/^https?:\/\//, '')}
        </p>
        <p className="text-tiny mb-6" style={{ color: 'var(--color-text-tertiary)' }}>
          Scan to open link
        </p>

        <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2 !py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download PNG
        </button>
      </div>
    </div>
  );
}
