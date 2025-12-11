"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn, signUp } from "../lib/supabase/auth";

type AuthDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export function AuthDialog({ onOpenChange, onSuccess }: AuthDialogProps & { open: boolean }) {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "info" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const result = mode === "login"
                ? await signIn(email, password)
                : await signUp(email, password);

            if (result.error) {
                // Friendlier error messages
                let errorMessage = result.error.message;
                if (errorMessage.includes("Invalid login credentials")) {
                    errorMessage = "Hmm, that email or password doesn't match our records. Please try again!";
                } else if (errorMessage.includes("already registered")) {
                    errorMessage = "Looks like you already have an account! Try signing in instead.";
                } else if (errorMessage.includes("Password should be")) {
                    errorMessage = "Please choose a stronger password (at least 6 characters).";
                }
                setMessage({ text: errorMessage, type: "error" });
            } else if (result.user) {
                if (mode === "signup" && !result.session) {
                    // Email confirmation required - show as success/info, not error!
                    setMessage({
                        text: "Almost there! 📧 Check your email to confirm your account.",
                        type: "success"
                    });
                } else {
                    onSuccess();
                    onOpenChange(false);
                    setEmail("");
                    setPassword("");
                    setMessage(null);
                }
            }
        } catch {
            setMessage({ text: "Something went wrong. Please try again!", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        setMessage(null);
    };

    return (
        <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {mode === "login" ? "Welcome Back! 👋" : "Join the Adventure! 🌍"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "login"
                            ? "Sign in to access your travel map from any device"
                            : "Create a free account to save your travels and sync across devices"
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {mode === "signup" && (
                            <p className="text-xs text-muted-foreground">
                                At least 6 characters
                            </p>
                        )}
                    </div>

                    {message && (
                        <div className={`text-sm p-3 rounded-md flex items-start gap-2 ${message.type === "error"
                                ? "text-red-700 bg-red-50 border border-red-200"
                                : message.type === "success"
                                    ? "text-green-700 bg-green-50 border border-green-200"
                                    : "text-blue-700 bg-blue-50 border border-blue-200"
                            }`}>
                            <span className="shrink-0">
                                {message.type === "error" ? "⚠️" : message.type === "success" ? "✅" : "ℹ️"}
                            </span>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : mode === "login"
                                ? "Sign In"
                                : "Create Account"
                        }
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    {mode === "login" ? (
                        <>
                            New to MyMap?{" "}
                            <button
                                onClick={toggleMode}
                                className="text-primary hover:underline font-medium"
                            >
                                Create a free account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={toggleMode}
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
