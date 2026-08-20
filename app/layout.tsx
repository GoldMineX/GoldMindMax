import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Token Stripper | Machine-to-Machine API',
  description: 'x402-gated content extraction engine optimized for AI agents and LLM token reduction.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0a0d14',
          color: '#e2e8f0',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
