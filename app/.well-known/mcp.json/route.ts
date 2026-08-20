import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json({
    schema_version: "v1",
    name: "Agent Token Stripper & Web Cleaner",
    description: "Extracts clean web content stripped of HTML tags, scripts, and CSS, saving up to 90% in LLM tokens.",
    payment_protocol: "x402",
    tools: [
      {
        name: "extract_clean_web_data",
        description: "Fetch web content stripped of bloat for cheap token processing.",
        endpoint: `${baseUrl}/api/v1/extract`,
        method: "GET",
        parameters: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Target URL to scrape and strip"
            }
          },
          required: ["url"]
        },
        pricing: {
          cost_per_call_usdc: "0.002",
          payment_header: "PAYMENT-SIGNATURE"
        }
      }
    ]
  });
}
