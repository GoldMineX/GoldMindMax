export default function HomePage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <header
        style={{
          borderBottom: '1px solid #1e293b',
          paddingBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#38bdf8' }}>
            ⚡ Agent Token Stripper API
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            Zero-UI Machine-to-Machine Infrastructure | x402 Protocol Ready
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#064e3b',
            color: '#34d399',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '1px solid #059669',
          }}
        >
          ● System Active
        </div>
      </header>

      {/* Node Metrics Overview */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#111827',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid #1f2937',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>PAYMENT PROTOCOL</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
            x402 / HTTP 402
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#111827',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid #1f2937',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>MCP DISCOVERY</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.25rem', color: '#38bdf8' }}>
            Enabled (v1)
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#111827',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid #1f2937',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>SETTLEMENT NETWORK</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.25rem', color: '#a855f7' }}>
            Base / USDC
          </div>
        </div>
      </section>

      {/* Machine Endpoints Section */}
      <section
        style={{
          backgroundColor: '#111827',
          borderRadius: '8px',
          border: '1px solid #1f2937',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, color: '#f87171' }}>
          🤖 Automated Agent Endpoints
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span
              style={{
                backgroundColor: '#1e3a8a',
                color: '#60a5fa',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                marginRight: '0.5rem',
              }}
            >
              GET
            </span>
            <code style={{ color: '#f1f5f9' }}>/api/v1/extract?url=https://example.com</code>
            <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              Main extraction route. Returns raw text stripped of scripts, styles, and bloat tags.
            </p>
          </div>

          <hr style={{ borderColor: '#1f2937', margin: '0.5rem 0' }} />

          <div>
            <span
              style={{
                backgroundColor: '#065f46',
                color: '#34d399',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                marginRight: '0.5rem',
              }}
            >
              GET
            </span>
            <code style={{ color: '#f1f5f9' }}>/.well-known/mcp.json</code>
            <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              Model Context Protocol (MCP) auto-registration schema for crawler discovery.
            </p>
          </div>
        </div>
      </section>

      {/* Machine Handshake Preview Code Block */}
      <section
        style={{
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          border: '1px solid #1e293b',
          padding: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '0.95rem', marginTop: 0, color: '#e2e8f0' }}>
          Agent Request Flow (Programmatic Usage)
        </h3>
        <pre
          style={{
            backgroundColor: '#020617',
            padding: '1rem',
            borderRadius: '6px',
            overflowX: 'auto',
            fontSize: '0.8rem',
            color: '#a7f3d0',
            margin: 0,
          }}
        >
          {`// Step 1: Agent queries without payment
GET /api/v1/extract?url=https://example.com
Response: HTTP 402 Payment Required
Headers: X-Payment-Protocol: x402/v2

// Step 2: Agent auto-signs transaction & retries
GET /api/v1/extract?url=https://example.com
Header: PAYMENT-SIGNATURE: <signed_usdc_payload>
Response: HTTP 200 OK + Clean Compressed Text`}
        </pre>
      </section>
    </main>
  );
}
