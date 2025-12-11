"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Confetti particle type
type Particle = {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    speedY: number;
    speedX: number;
    speedRotation: number;
};

// Confetti colors - vibrant celebration palette
const CONFETTI_COLORS = [
    "#10b981", // emerald
    "#f59e0b", // amber
    "#3b82f6", // blue
    "#ec4899", // pink
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
];

function Confetti() {
    const [particles, setParticles] = useState<Particle[]>([]);

    const createParticles = useCallback(() => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 150; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 100,
                rotation: Math.random() * 360,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                size: 8 + Math.random() * 8,
                speedY: 2 + Math.random() * 3,
                speedX: -1 + Math.random() * 2,
                speedRotation: -3 + Math.random() * 6,
            });
        }
        setParticles(newParticles);
    }, []);

    useEffect(() => {
        createParticles();

        // Animation loop
        const interval = setInterval(() => {
            setParticles(prev =>
                prev.map(p => ({
                    ...p,
                    y: p.y + p.speedY,
                    x: p.x + p.speedX,
                    rotation: p.rotation + p.speedRotation,
                })).filter(p => p.y < 120)
            );
        }, 50);

        // Cleanup
        return () => clearInterval(interval);
    }, [createParticles]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size * 0.6,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg)`,
                        borderRadius: "2px",
                    }}
                />
            ))}
        </div>
    );
}

export default function ConfirmSuccessPage() {
    const [showConfetti, setShowConfetti] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Stop confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
            {showConfetti && <Confetti />}

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
                {/* Success icon with animation */}
                <div className="mb-8 relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    {/* Pulse rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full animate-ping" />
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
                    You&apos;re All Set! 🎉
                </h1>

                {/* Subheading */}
                <p className="text-xl text-muted-foreground mb-2">
                    Your email has been confirmed
                </p>
                <p className="text-muted-foreground mb-8">
                    Welcome to the MyMap community! Your travel adventures await.
                </p>

                {/* Stats teaser */}
                <div className="flex justify-center gap-8 mb-10">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary">195</div>
                        <div className="text-xs text-muted-foreground">Countries to explore</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-500">∞</div>
                        <div className="text-xs text-muted-foreground">Memories to make</div>
                    </div>
                </div>

                {/* CTA Button */}
                <Link href="/">
                    <Button
                        size="lg"
                        className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/25 transition-all hover:scale-105"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                            <path d="M2 12h20" />
                        </svg>
                        Start Mapping Your Journey
                    </Button>
                </Link>

                {/* Subtle footer text */}
                <p className="mt-8 text-sm text-muted-foreground">
                    Your data syncs automatically across all your devices ☁️
                </p>
            </div>
        </main>
    );
}
