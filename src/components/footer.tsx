export function Footer() {
  return (
    <footer
      className="border-t py-12 mt-20"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Product
            </h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'API', 'Changelog'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Company
            </h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Report Abuse', href: '/report' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Developers
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'API Docs', href: '/api-docs' },
                { label: 'Status', href: '#' },
                { label: 'GitHub', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand-500">
              <path
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>SnapLink</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            © {new Date().getFullYear()} SnapLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
