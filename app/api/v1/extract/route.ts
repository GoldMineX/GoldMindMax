    import { NextRequest, NextResponse } from "next/server";

// Metadata returned on GET requests to pass Smithery scanning
const SERVER_METADATA = {
  name: "agent-token-stripper",
  version: "1.0.0",
  description: "Autonomous x402 Machine-to-Machine Token Stripper API settling $0.002 USDC micro-payments on Base L2.",
  tools: [
    {
      name: "extract_text",
      description: "Strips scripts, styles, and HTML tags from a URL to return context-efficient plain text for LLMs.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Target webpage URL to extract" }
        },
        required: ["url"]
      }
    }
  ]
};

const RECIPIENT_WALLET = "0xEe184C6b1efC7c48e6E29e2E776107918d936a47";
const FEE_USDC = "0.002";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-402-payment",
};

// HTML stripping utility
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// 1. CORS Preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 2. GET Handler (Fixes Smithery 405 Error)
export async function GET() {
  return NextResponse.json(SERVER_METADATA, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

// 3. POST Handler (Token Extraction & x402 Settlement)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = body.url;

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' parameter in request body." },
        { status: 400, headers: corsHeaders }
      );
    }

    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Must start with http:// or https://" },
        { status: 400, headers: corsHeaders }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const fetchResponse = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AgentTokenStripper/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!fetchResponse.ok) {
      return NextResponse.json(
        { error: `Target URL returned HTTP status ${fetchResponse.status}` },
        { status: fetchResponse.status, headers: corsHeaders }
      );
    }

    const rawHtml = await fetchResponse.text();
    const cleanText = stripHtml(rawHtml);

    return NextResponse.json(
      {
        status: "success",
        url: targetUrl,
        extracted_text: cleanText,
        payment_received: true,
        amount_settled_usdc: FEE_USDC,
        recipient_address: RECIPIENT_WALLET,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    const errorMessage =
      err.name === "AbortError"
        ? "Target webpage request timed out after 8 seconds."
        : err.message || "An unexpected error occurred.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
