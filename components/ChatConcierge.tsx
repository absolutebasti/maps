"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/state/store";
import { getUnlockedBadges, getContinentsVisited } from "@/lib/badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

const STORAGE_KEY = "mapmystay_chat_history";

// Quick action suggestions
const QUICK_ACTIONS = [
    "Where should I go next?",
    "What badges am I close to?",
    "Recommend an island destination",
    "Tell me about my travel stats",
];

// Format AI messages with proper line breaks and bullet points
function FormattedMessage({ content }: { content: string }) {
    // First, normalize inline bullets: split on bullet characters that appear mid-text
    // This handles cases where AI writes "text • bullet1 • bullet2" without newlines
    const normalizedContent = content
        .replace(/\s+[•\-\*]\s+/g, '\n• ') // Convert inline bullets to newlines
        .replace(/^[•\-\*]\s*/gm, '• ');    // Normalize bullet markers

    const lines = normalizedContent.split('\n').filter(line => line.trim());

    return (
        <div className="space-y-2">
            {lines.map((line, i) => {
                const trimmedLine = line.trim();
                const isBullet = /^[•\-\*]\s?/.test(trimmedLine);

                if (isBullet) {
                    return (
                        <div key={i} className="flex gap-2 items-start">
                            <span className="text-purple-400 flex-shrink-0">•</span>
                            <span>{trimmedLine.replace(/^[•\-\*]\s*/, '')}</span>
                        </div>
                    );
                }
                return <p key={i}>{trimmedLine}</p>;
            })}
        </div>
    );
}

export function ChatConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const countriesById = useAppStore((s) => s.countriesById);

    // Calculate travel context
    const travelContext = useMemo(() => {
        const visitedCountryIds = Object.entries(countriesById)
            .filter(([, data]) => data.visited)
            .map(([id]) => id);

        const badges = getUnlockedBadges(visitedCountryIds.length).map((b) => b.name);
        const continents = getContinentsVisited(visitedCountryIds);

        return {
            visitedCountries: visitedCountryIds,
            badges,
            continents,
        };
    }, [countriesById]);

    // Load chat history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch {
                // Invalid JSON, ignore
            }
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50))); // Keep last 50 messages
        }
    }, [messages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: messageText.trim(),
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    history: messages.slice(-10).map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    context: travelContext,
                }),
            });

            const data = await response.json();

            const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.message || "I'm having trouble responding. Please try again!",
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, I'm having trouble connecting. Please try again!",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, messages, travelContext]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50",
                    "px-4 py-3 rounded-full shadow-lg",
                    "bg-gradient-to-br from-purple-500 to-indigo-600",
                    "flex items-center gap-2",
                    "hover:scale-105 active:scale-95 transition-transform",
                    "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
                    isOpen && "hidden"
                )}
                aria-label="Get AI Travel Recommendations"
            >
                <span className="text-xl">🤖</span>
                <span className="text-sm font-medium text-white hidden sm:inline">Get AI Travel Recommendations</span>
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50",
                        "w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] sm:max-h-[600px]",
                        "bg-background/95 backdrop-blur-xl",
                        "rounded-2xl shadow-2xl border",
                        "flex flex-col overflow-hidden",
                        "animate-in slide-in-from-bottom-4 fade-in duration-300"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <div>
                                <h3 className="font-semibold text-sm">Travel Concierge</h3>
                                <p className="text-xs text-muted-foreground">AI-powered assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={clearHistory}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground text-xs"
                                title="Clear history"
                            >
                                🗑️
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-md hover:bg-muted"
                                aria-label="Close chat"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <span className="text-4xl block mb-3">🌍</span>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Hi! I'm your AI travel companion. Ask me anything about destinations,
                                    your travel stats, or get personalized recommendations!
                                </p>
                                <div className="space-y-2">
                                    {QUICK_ACTIONS.map((action) => (
                                        <button
                                            key={action}
                                            onClick={() => sendMessage(action)}
                                            className="block w-full text-left px-3 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] px-4 py-2 rounded-2xl text-sm",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-md"
                                            : "bg-muted rounded-bl-md"
                                    )}
                                >
                                    {message.role === "assistant" ? (
                                        <FormattedMessage content={message.content} />
                                    ) : (
                                        message.content
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about destinations..."
                                className="flex-1 px-4 py-2 text-sm rounded-full border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!input.trim() || isLoading}
                                className="rounded-full px-4"
                            >
                                ➤
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
