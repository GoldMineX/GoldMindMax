# Agent Token Stripper (MCP Server + x402)

[![x402 Enabled](https://img.shields.io/badge/x402-Micro--Payments-blue)](https://basescan.org/address/0xEe184C6b1efC7c48e6E29e2E776107918d936a47)
[![Base Network](https://img.shields.io/badge/Network-Base%20L2-0052FF)](https://base.org)
[![MCP Protocol](https://img.shields.io/badge/Protocol-MCP-green)](https://smithery.ai/server/agent-token-stripper/token-stripper)

An autonomous Model Context Protocol (MCP) tool that strips HTML, CSS, scripts, and layout bloat from raw webpages. It converts bloated web traffic into clean, token-dense plain text before feeding it to LLM context windows, cutting API usage costs by up to 80%.

Monetized via native machine-to-machine **x402 micro-payments** ($0.002 USDC per request on Base L2).

---

## Key Features

* **Context Efficiency:** Strips `<script>`, `<style>`, `<nav>`, `<header>`, and HTML tags, saving up to 15,000+ unnecessary tokens per web page request.
* **x402 Native Settlement:** Autonomous agents execute payments directly on-chain without human credit cards or API keys.
* **Anti-Blocking User-Agent:** Spoofs clean browser headers to reduce `403 Forbidden` scraping blocks on target URLs.
* **Strict Timeout Control:** Aborts target fetches after 8 seconds to prevent agent pipeline timeouts.

---

## Quick Setup for Claude

### 1. Claude Code CLI

Add the tool directly to your Claude Code CLI with a single command:

```bash
claude mcp add --transport http agent-token-stripper [https://gold-mind-max.vercel.app/api/extract](https://gold-mind-max.vercel.app/api/extract) --scope user
