import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--color-text)' }}>
              Simple, transparent pricing
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Start for free. Upgrade when you need more power and advanced analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="card-premium flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Basic</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>$0</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>/forever</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Everything you need for personal use.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited basic short links', 'Standard analytics (30 days)', 'QR code generation', 'API access (Rate limited)'].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                    <svg className="w-5 h-5 text-success-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-secondary w-full text-center">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="card-premium border-brand-500 relative flex flex-col shadow-glow scale-105 z-10" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>$9</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>/month</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Advanced tools for creators and pros.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Everything in Basic', 'Custom link aliases', 'Advanced analytics (1 year)', 'Link password protection', 'Edit destination URLs', 'Higher API limits'].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                    <svg className="w-5 h-5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary w-full text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Business Tier */}
            <div className="card-premium flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Business</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>$29</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>/month</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>For teams and custom domains.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Everything in Pro', 'Custom domains (yourbrand.com)', 'Team collaboration (up to 5)', 'Bulk link creation', 'SSO & Advanced Security', 'Priority Support'].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                    <svg className="w-5 h-5 text-success-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-secondary w-full text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
