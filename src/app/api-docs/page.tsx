import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function ApiDocsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>API Reference</h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Integrate SnapLink directly into your application.
            </p>
          </div>

          <div className="space-y-12">
            {/* Create Link Endpoint */}
            <section className="card-premium">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-success-500/10 text-success-600 dark:text-success-400">POST</span>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>/api/shorten</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Create a new short link. No authentication required for basic usage.
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Request Body</h3>
                <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                  <pre>
{`{
  "url": "https://example.com/very/long/url/path",
  "customAlias": "my-brand" // Optional
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Response</h3>
                <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                  <pre>
{`{
  "success": true,
  "shortUrl": "https://snaplink.app/my-brand",
  "code": "my-brand",
  "originalUrl": "https://example.com/...",
  "createdAt": "2023-10-27T10:00:00Z"
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Check Alias Endpoint */}
            <section className="card-premium">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">GET</span>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>/api/alias/check</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Check if a custom alias is available before attempting to create it.
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Query Parameters</h3>
                <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-lg p-4 text-sm">
                  <code className="font-mono text-brand-600 dark:text-brand-400">?alias=my-brand</code> - The alias to check (required)
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Response</h3>
                <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                  <pre>
{`{
  "available": true
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Examples</h2>
              
              <div className="card-premium">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>cURL</h3>
                <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                  <pre>
{`curl -X POST https://snaplink.app/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
                  </pre>
                </div>
              </div>

              <div className="card-premium mt-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>JavaScript / Node.js</h3>
                <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
                  <pre>
{`const response = await fetch('https://snaplink.app/api/shorten', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});

const data = await response.json();
console.log(data.shortUrl);`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
