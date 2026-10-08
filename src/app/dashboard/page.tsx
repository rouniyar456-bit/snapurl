'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login');
        } else {
          fetchLinks();
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
      } else {
        setError(data.error || 'Failed to load links.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortCode: string) => {
    const url = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      const res = await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Manage your short links and view analytics.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="btn-primary">
                Create Link
              </button>
              <button onClick={handleLogout} className="btn-secondary">
                Log out
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-lg bg-danger-50 text-danger-600 dark:bg-danger-900/20 dark:text-danger-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <span className="spinner w-8 h-8 text-brand-500" />
            </div>
          ) : links.length === 0 ? (
            <div className="card-premium text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-500 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No links yet</h3>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Your shortened links will appear here once you create them.
              </p>
              <button onClick={() => router.push('/')} className="btn-primary">
                Shorten your first link
              </button>
            </div>
          ) : (
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Short Link</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] hidden md:table-cell">Original URL</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Clicks</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {links.map((link) => (
                      <tr key={link.id} className="hover:bg-[var(--color-surface-raised)]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`/${link.shortCode}`} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
                            {typeof window !== 'undefined' ? window.location.host : 'snaplink.app'}/{link.shortCode}
                          </a>
                          <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
                            {new Date(link.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="max-w-[300px] lg:max-w-[400px] truncate text-sm text-[var(--color-text-secondary)]" title={link.originalUrl}>
                            {link.originalUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                            {link.clickCount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button onClick={() => handleCopy(link.shortCode)} className="btn-ghost !p-2 inline-flex items-center justify-center" title="Copy">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(link.id)} className="btn-ghost !p-2 inline-flex items-center justify-center hover:!text-danger-500 hover:!bg-danger-50 dark:hover:!bg-danger-900/20" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
