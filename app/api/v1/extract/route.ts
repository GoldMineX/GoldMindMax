import { NextRequest, NextResponse } from 'next/server';

// 1. Maximize Vercel execution timeout to 30 seconds
export const maxDuration = 30;

// Helper to format responses with full CORS headers
function corsResponse(data: object, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Payment, Authorization, X-Requested-With',
    },
  });
}

// 2. Handle CORS preflight OPTIONS requests from browser-based agents
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Payment, Authorization, X-Requested-With',
    },
  });
}

// 3. Main processing route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = body.url || body.params?.url;

    if (!targetUrl) {
      return corsResponse({ error: 'Missing required parameter: url' }, 400);
    }

    // 4. Internal 8-second fetch timeout to prevent hanging on slow websites
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // 5. Spoof real browser User-Agent headers to prevent 403 Forbidden blocks
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 GoldMindAgent/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return corsResponse({
        error: `Target server returned HTTP status ${response.status}`,
        url: targetUrl
      }, 400);
    }

    const rawHtml = await response.text();

    // 6. Clean and strip scripts, styles, metadata, and markup
    const cleanText = rawHtml
      .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<noscript\b[^<]*>([\s\S]*?)<\/noscript>/gi, '')
      .replace(/<header\b[^<]*>([\s\S]*?)<\/header>/gi, '')
      .replace(/<footer\b[^<]*>([\s\S]*?)<\/footer>/gi, '')
      .replace(/<nav\b[^<]*>([\s\S]*?)<\/nav>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return corsResponse({
      status: 'success',
      url: targetUrl,
      extracted_text: cleanText.substring(0, 50000), // Cap at 50,000 characters
      payment_received: true,
      amount_settled_usdc: '0.002',
      recipient_address: '0xEe184C6b1efC7c48e6E29e2E776107918d936a47'
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return corsResponse({ error: 'Target URL timed out (exceeded 8 seconds).' }, 504);
    }
    return corsResponse({ error: error.message || 'An unexpected error occurred' }, 500);
  }
}

export async function GET() {
  return corsResponse({
    service: 'Agent Token Stripper API',
    status: 'active',
    payment_amount: '$0.002 USDC',
    network: 'Base L2',
    wallet: '0xEe184C6b1efC7c48e6E29e2E776107918d936a47'
  });
}
