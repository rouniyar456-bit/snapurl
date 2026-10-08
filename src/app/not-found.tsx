import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="text-center px-4 max-w-md mx-auto animate-slide-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: 'var(--color-brand-subtle)',
              color: 'var(--color-brand)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-danger-500" />
            </svg>
          </div>
          
          <h1 className="text-heading mb-3" style={{ color: 'var(--color-text)' }}>
            Lost the link?
          </h1>
          <p className="text-body mb-8 text-balance" style={{ color: 'var(--color-text-secondary)' }}>
            This page doesn&apos;t exist — but we can shorten the next one.
          </p>
          
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Shorten a URL
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
