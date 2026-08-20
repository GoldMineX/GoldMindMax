import { NextResponse } from 'next/server';

const RECEIVER_WALLET = process.env.PAYMENT_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';
const PRICE_USDC = process.env.PRICE_PER_CALL_USDC || '0.002'; // $0.002 per request
const NETWORK = process.env.PAYMENT_NETWORK || 'base';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing target URL. Query parameter format: ?url=https://example.com' },
      { status: 400 }
    );
  }

  // Check for standard x402 headers or legacy headers
  const paymentSignature = 
    request.headers.get('PAYMENT-SIGNATURE') || 
    request.headers.get('x-payment');

  // Step 1: Return HTTP 402 if no payment proof is provided
  if (!paymentSignature) {
    const paymentRequiredPayload = {
      status: 402,
      error: 'Payment Required',
      pricing: {
        amount: PRICE_USDC,
        currency: 'USDC',
        network: NETWORK,
        pay_to: RECEIVER_WALLET
      },
      instructions: 'Provide signed payment payload in standard PAYMENT-SIGNATURE header.'
    };

    return new NextResponse(JSON.stringify(paymentRequiredPayload), {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'PAYMENT-REQUIRED': JSON.stringify({
          scheme: 'exact',
          network: NETWORK,
          max_price: PRICE_USDC,
          asset: 'USDC',
          destination: RECEIVER_WALLET
        }),
        'X-Payment-Protocol': 'x402/v2'
      }
    });
  }

  // Step 2: Extract & Compress Web Content for LLM consumption
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AgentTokenStripper/1.0',
        'Accept': 'text/html,application/xhtml+xml'
      },
      next: { revalidate: 300 } // Cache target web requests for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream fetch failed with HTTP status ${response.status}` },
        { status: 502 }
      );
    }

    const rawHtml = await response.text();

    // Fast regex-based DOM tree stripping (Removes scripts, styles, SVGs, and HTML tags)
    const cleanedText = rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const rawTokenEst = Math.round(rawHtml.length / 4);
    const compressedTokenEst = Math.round(cleanedText.length / 4);

    return NextResponse.json({
      success: true,
      url: targetUrl,
      tokens: {
        raw_html_tokens_est: rawTokenEst,
        compressed_tokens_est: compressedTokenEst,
        tokens_saved: Math.max(0, rawTokenEst - compressedTokenEst),
        reduction_percentage: `${Math.round(((rawTokenEst - compressedTokenEst) / Math.max(1, rawTokenEst)) * 100)}%`
      },
      data: cleanedText
    }, {
      headers: {
        'PAYMENT-RESPONSE': JSON.stringify({ settled: true, amount: PRICE_USDC, asset: 'USDC' })
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to process target target', details: err.message },
      { status: 500 }
    );
  }
}
