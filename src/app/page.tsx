import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { UrlShortener } from '@/components/url-shortener';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ─── Hero Section ──────────────────────────── */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-16 pb-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* The image file will be integrated here */}
            <Image 
              src="/hero-bg.jpg" 
              alt="Hero Background" 
              fill 
              priority
              className="object-cover"
            />
            {/* Very subtle bottom gradient just to fade into the next section */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
          </div>
          


          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center drop-shadow-2xl">
            {/* Eyebrow */}
            <div className="mb-6 animate-fade-in">
              <span
                className="inline-flex items-center gap-2 text-tiny font-medium uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border"
                style={{
                  color: 'var(--color-text-tertiary)',
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
                Fast &bull; Simple &bull; Free
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-display font-bold tracking-tight mb-4 animate-fade-in text-balance"
              style={{ color: 'var(--color-text)', animationDelay: '0.05s', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              Short links.{' '}
              <span className="bg-gradient-to-r from-brand-500 to-brand-400 bg-clip-text text-transparent">
                Instantly.
              </span>
            </h1>

            {/* Subhead */}
            <p
              className="text-lg sm:text-xl mb-10 max-w-lg mx-auto animate-fade-in text-balance font-medium"
              style={{ color: 'var(--color-text-secondary)', animationDelay: '0.1s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              Turn long, messy URLs into clean links you can share anywhere.
            </p>

            {/* URL Shortener */}
            <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <UrlShortener />
            </div>
          </div>
        </section>

        {/* ─── Social Proof ──────────────────────────── */}
        <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                { number: '10M+', label: 'Links shortened' },
                { number: '99.9%', label: 'Uptime' },
                { number: '<50ms', label: 'Redirect speed' },
                { number: '150+', label: 'Countries served' },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4">
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {stat.number}
                  </p>
                  <p className="text-tiny" style={{ color: 'var(--color-text-tertiary)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ──────────────────────────────── */}
        <section id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-tiny font-medium uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-brand)' }}>
                Features
              </p>
              <h2 className="text-heading mb-3" style={{ color: 'var(--color-text)' }}>
                Everything you need. Nothing you don&apos;t.
              </h2>
              <p className="text-body max-w-lg mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Built for speed and simplicity, with the tools to grow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  ),
                  title: 'Instant shortening',
                  description: 'Generate a short link in milliseconds. No waiting, no friction.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20V10M18 20V4M6 20v-4" />
                    </svg>
                  ),
                  title: 'Click analytics',
                  description: 'See who clicks, when, and from where. Clean and actionable.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  ),
                  title: 'Custom aliases',
                  description: 'Choose a memorable alias that fits your brand perfectly.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="3" height="3" />
                    </svg>
                  ),
                  title: 'QR codes',
                  description: 'Generate a downloadable QR code for any short link.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ),
                  title: 'Secure by default',
                  description: 'Rate limiting, abuse prevention, and HTTPS everywhere.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                  ),
                  title: 'Developer API',
                  description: 'Simple REST API for programmatic access and integrations.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="card-premium group hover:shadow-card-hover transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: 'var(--color-brand-subtle)',
                      color: 'var(--color-brand)',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-title mb-2" style={{ color: 'var(--color-text)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ──────────────────────────── */}
        <section className="py-20" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-tiny font-medium uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-brand)' }}>
                How it works
              </p>
              <h2 className="text-heading" style={{ color: 'var(--color-text)' }}>
                Three steps. Zero friction.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Paste your URL', description: 'Drop in any long URL.' },
                { step: '2', title: 'Click shorten', description: 'We generate a clean link instantly.' },
                { step: '3', title: 'Share anywhere', description: 'Copy and send. That\'s it.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold"
                    style={{
                      backgroundColor: 'var(--color-brand-subtle)',
                      color: 'var(--color-brand)',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-title mb-2" style={{ color: 'var(--color-text)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-heading" style={{ color: 'var(--color-text)' }}>
                Questions & answers
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Is SnapLink free?',
                  a: 'Yes. Basic URL shortening is completely free with no account required.',
                },
                {
                  q: 'How long do links last?',
                  a: 'Links don\'t expire. Once created, your short link works indefinitely.',
                },
                {
                  q: 'Can I customize my short link?',
                  a: 'Absolutely. Use the "Customize" option to pick a memorable alias.',
                },
                {
                  q: 'Is there an API?',
                  a: 'Yes. Our REST API lets you shorten URLs programmatically. Check the API docs.',
                },
                {
                  q: 'Is it secure?',
                  a: 'We use HTTPS everywhere, rate limiting, and abuse detection to keep the platform safe.',
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group card-premium !p-0 overflow-hidden"
                >
                  <summary
                    className="flex items-center justify-between px-6 py-4 cursor-pointer text-title select-none"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {faq.q}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="shrink-0 ml-4 transition-transform duration-200 group-open:rotate-180"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Section ───────────────────────────── */}
        <section className="py-20" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-heading mb-3" style={{ color: 'var(--color-text)' }}>
              Ready to shorten?
            </h2>
            <p className="text-body mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              No signup required. Just paste and go.
            </p>
            <a
              href="#"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start shortening
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
