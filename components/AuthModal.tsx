"use client";

import { useState } from "react";
import { Button } from "./ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!name.trim()) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
      }

      // For now, we'll use localStorage-based authentication
      // In production, replace with actual API calls
      const users = JSON.parse(localStorage.getItem("mymap_users") || "{}");

      if (mode === "register") {
        if (users[email]) {
          setError("Email already registered");
          setLoading(false);
          return;
        }
        users[email] = {
          name,
          password, // In production, this should be hashed
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("mymap_users", JSON.stringify(users));
      } else {
        const user = users[email];
        if (!user || user.password !== password) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }
      }

      // Set auth session
      localStorage.setItem(
        "mymap_auth",
        JSON.stringify({
          email,
          name: mode === "register" ? name : users[email].name,
          loggedInAt: new Date().toISOString(),
        })
      );

      onSuccess(email);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 border">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-lemon-milk)" }}>
              {mode === "login" ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "login"
                ? "Sign in to save your travel map and access all features"
                : "Join to unlock unlimited access to your travel maps"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium block mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="••••••••"
                required
                minLength={mode === "register" ? 6 : 1}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-primary hover:underline"
            >
              {mode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

