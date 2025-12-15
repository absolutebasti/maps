// Anthropic Claude AI Client
// Configured for travel concierge and recommendations

import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client only if API key is available
export const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

// Check if AI features are available
export function isAIAvailable(): boolean {
    return anthropic !== null;
}

// Model to use - Haiku for fast responses
export const AI_MODEL = "claude-3-haiku-20240307";

// Token limits
export const MAX_TOKENS = 1024;
