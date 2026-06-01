"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { analytics } from "./../lib/analytics";

const ONBOARDING_KEY = "mymap.onboarding.completed";

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      // Small delay to ensure page is loaded
      setTimeout(() => setShow(true), 300);
    }
  }, []);

  // Track initial step view - only when dialog first opens
  useEffect(() => {
    if (show && step === 0) {
      analytics.onboardingStepViewed(1, steps.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]); // Intentionally only tracking when dialog opens, not on every step change

  // Keyboard navigation
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, step]);

  const steps = [
    {
      title: "Welcome to MyMap! 🗺️",
      description: "Your personal travel map awaits.",
      icon: "🗺️",
      content: (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-center">
            <div className="text-6xl animate-bounce">{/* Globe emoji */}</div>
          </div>
          <p className="text-center">
            <strong>Tap any country</strong> on the map to start tracking your adventures.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            💡 <strong>On mobile?</strong> Use the menu button at the bottom for all features
          </div>
        </div>
      ),
    },
    {
      title: "Mark Your Travels ✨",
      description: "Every country tells a story.",
      icon: "✨",
      content: (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-center">
            <div className="text-6xl animate-pulse">{/* Sparkles emoji */}</div>
          </div>
          <p className="text-center">
            <strong>Mark countries as visited</strong> and capture your memories with <strong>notes, dates, and ratings</strong>.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            💡 <strong>Pro tip:</strong> Add tags like "Favorite" or "Want to Visit" to organize your travels
          </div>
        </div>
      ),
    },
    {
      title: "Search & Explore 🔍",
      description: "Find any country instantly.",
      icon: "🔍",
      content: (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-center">
            <div className="text-6xl">{/* Search emoji */}</div>
          </div>
          <p className="text-center">
            <strong>Search for countries</strong> and the map will <strong>auto-zoom</strong> to your selection.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            💡 <strong>Mobile:</strong> Open the menu (☰) to search
          </div>
        </div>
      ),
    },
    {
      title: "Export & Share 📤",
      description: "Share your travel map with the world.",
      icon: "📤",
      content: (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-center">
            <div className="text-6xl animate-bounce">{/* Share emoji */}</div>
          </div>
          <p className="text-center">
            <strong>Export high-resolution images</strong> or <strong>share instantly</strong> with friends and family.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            💡 <strong>Mobile:</strong> All features available in the menu (☰)
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      if (step < steps.length - 1) {
        const newStep = step + 1;
        analytics.onboardingStepViewed(newStep + 1, steps.length);
        setStep(newStep);
      } else {
        handleComplete();
      }
      setIsAnimating(false);
    }, 150);
  };

  const handleBack = () => {
    if (isAnimating || step === 0) return;

    setIsAnimating(true);
    setTimeout(() => {
      const newStep = step - 1;
      analytics.onboardingStepBack(newStep + 1, steps.length);
      setStep(newStep);
      setIsAnimating(false);
    }, 150);
  };

  const handleSkip = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    analytics.onboardingSkipped(step + 1, steps.length, timeSpent);
    handleComplete();
  };

  const handleComplete = () => {
    analytics.onboardingCompleted();
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
  };



  if (!show) return null;

  const currentStep = steps[step];
  const progressPercentage = ((step + 1) / steps.length) * 100;
  const canGoBack = step > 0;

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-md relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        {/* Close/Skip button in top-right corner - More prominent */}
        <button
          onClick={handleSkip}
          className="absolute right-3 top-3 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border/50 opacity-80 hover:opacity-100 hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm"
          aria-label="Skip onboarding"
          title="Skip tutorial (Esc)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="sr-only">Skip</span>
        </button>

        <DialogHeader className="space-y-4 relative z-10">
          {/* Step number badge */}
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              Step {step + 1} of {steps.length}
            </div>
          </div>

          <DialogTitle className="text-3xl font-bold text-center">
            {currentStep.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className={`py-6 px-1 relative z-10 transition-opacity duration-200 ${isAnimating ? "opacity-50" : "opacity-100"}`}>
          {currentStep.content}
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="space-y-3 py-4 relative z-10">
          {/* Progress bar with animation */}
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Step counter and percentage */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              {Math.round(progressPercentage)}% complete
            </span>
            <span className="text-muted-foreground">
              {step + 1} / {steps.length} steps
            </span>
          </div>

          {/* Enhanced step dots with completion states */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => {
              const isActive = i === step;
              const isCompleted = i < step;
              const isUpcoming = i > step;

              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${isActive
                    ? "bg-primary w-10 h-2.5 shadow-md"
                    : isCompleted
                      ? "bg-primary/60 w-6 h-2.5"
                      : "bg-muted w-2.5 h-2.5"
                    }`}
                  aria-label={`Step ${i + 1}${isActive ? " (current)" : isCompleted ? " (completed)" : ""}`}
                >
                  {isCompleted && (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-foreground"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="text-center text-xs text-muted-foreground pb-2 relative z-10">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>{" "}
          <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> to navigate •{" "}
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to skip
        </div>

        <DialogFooter className="gap-2 sm:gap-3 relative z-10">
          {/* Back button - only show if not on first step */}
          {canGoBack && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isAnimating}
              className="flex-1 sm:flex-initial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          )}

          {/* Skip button - more prominent */}
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isAnimating}
            className={`flex-1 sm:flex-initial border-2 ${canGoBack ? "" : "flex-1"}`}
          >
            I&apos;ll explore myself
          </Button>

          {/* Next/Get Started button */}
          <Button
            onClick={handleNext}
            disabled={isAnimating}
            className="flex-1 sm:flex-initial min-w-[120px]"
          >
            {step === steps.length - 1 ? (
              <>
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
