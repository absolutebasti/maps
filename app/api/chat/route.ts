// AI Chat API Route
// Handles conversation with the travel concierge

import { NextRequest, NextResponse } from "next/server";
import { anthropic, AI_MODEL, MAX_TOKENS, isAIAvailable } from "@/lib/anthropic/client";
import { TRAVEL_CONCIERGE_PROMPT, buildTravelContext } from "@/lib/anthropic/prompts";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface ChatRequest {
    message: string;
    history?: ChatMessage[];
    context?: {
        visitedCountries?: string[];
        badges?: string[];
        continents?: string[];
    };
}

// Fallback responses for demo mode (no API key)
const DEMO_RESPONSES = [
    "That's a great question! Based on your travel history, I'd recommend exploring Southeast Asia next. Countries like Thailand and Vietnam offer incredible experiences and would help you earn the 'Asia Adventurer' badge! 🌏",
    "Looking at your map, you're making amazing progress! Have you considered visiting Portugal? It's a fantastic destination with beautiful coastlines, delicious food, and would add to your European adventures! 🇵🇹",
    "Wow, you've been to some incredible places! To unlock the 'Island Hopper' badge, consider visiting the Maldives or Fiji. Both offer stunning beaches and unique cultures! 🏝️",
    "I love your adventurous spirit! For your next trip, consider a landlocked country like Switzerland or Austria. The Alps are breathtaking and you'd make progress on the 'Landlocked Expert' badge! ⛰️",
    "Based on your travel patterns, it looks like you enjoy diverse experiences. How about exploring South America? Countries like Peru and Colombia offer incredible history, food, and landscapes! 🌎",
];

function getDemoResponse(): string {
    return DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { message, history = [], context = {} } = body;

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Demo mode - return fallback response
        if (!isAIAvailable()) {
            return NextResponse.json({
                message: getDemoResponse(),
                isDemo: true,
            });
        }

        // Build conversation with context
        const travelContext = buildTravelContext(
            context.visitedCountries || [],
            context.badges || [],
            context.continents || []
        );

        const systemPrompt = `${TRAVEL_CONCIERGE_PROMPT}\n\n${travelContext}`;

        // Format messages for Anthropic API
        const messages = [
            ...history.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })),
            { role: "user" as const, content: message },
        ];

        // Call Anthropic API
        const response = await anthropic!.messages.create({
            model: AI_MODEL,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            messages,
        });

        // Extract text content
        const textContent = response.content.find((c) => c.type === "text");
        const aiMessage = textContent?.type === "text" ? textContent.text : "I'm having trouble responding right now. Please try again!";

        return NextResponse.json({
            message: aiMessage,
            isDemo: false,
        });
    } catch (error) {
        console.error("Chat API error:", error);

        // Return demo response on error
        return NextResponse.json({
            message: getDemoResponse(),
            isDemo: true,
            error: "AI service temporarily unavailable",
        });
    }
}
