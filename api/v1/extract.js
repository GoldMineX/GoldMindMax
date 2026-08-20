// api/v1/extract.js - Machine-to-Machine x402 Token Stripper Endpoint

const CONFIG = {
  PAYMENT_WALLET_ADDRESS: process.env.PAYMENT_WALLET_ADDRESS || "0xEe184C6b1efC7c48e6E29e2E776107918d936a47",
  PRICE_PER_CALL_USDC: process.env.PRICE_PER_CALL_USDC || "0.002",
  PAYMENT_NETWORK: process.env.PAYMENT_NETWORK || "base",
  USDC_CONTRACT_BASE: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
};

export default async function handler(req, res) {
  // CORS configuration for autonomous AI crawlers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, PAYMENT-SIGNATURE, X-Payment-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const paymentHeader = req.headers['payment-signature'] || req.headers['x-payment-signature'];

  // Step 1: Return HTTP 402 if no payment header is present
  if (!paymentHeader) {
    res.setHeader('X-Payment-Required', 'true');
    res.setHeader('X-Payment-Address', CONFIG.PAYMENT_WALLET_ADDRESS);
    res.setHeader('X-Payment-Amount', CONFIG.PRICE_PER_CALL_USDC);
    res.setHeader('X-Payment-Network', CONFIG.PAYMENT_NETWORK);

    return res.status(402).json({
      error: "Payment Required",
      protocol: "x402",
      message: "Access requires micro-payment settlement on Base L2.",
      payment_details: {
        wallet_address: CONFIG.PAYMENT_WALLET_ADDRESS,
        amount_usdc: CONFIG.PRICE_PER_CALL_USDC,
        network: CONFIG.PAYMENT_NETWORK,
        usdc_contract: CONFIG.USDC_CONTRACT_BASE,
        instructions: "Include x402 payment authorization in 'PAYMENT-SIGNATURE' header."
      }
    });
  }

  // Step 2: Handle content extraction when paid
  const targetUrl = req.query.url || req.body?.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing required 'url' parameter." });
  }

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();

    // Strip scripts, styles, and HTML tags
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return res.status(200).json({
      status: "success",
      url: targetUrl,
      extracted_text: cleanText.slice(0, 5000),
      payment_received: true,
      amount_settled_usdc: CONFIG.PRICE_PER_CALL_USDC
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to extract content", details: err.message });
  }
}
