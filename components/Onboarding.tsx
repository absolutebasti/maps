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

const ONBOARDING_KEY = "mymap.onboarding.completed";

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to MyMap! 🗺️",
      description: "Track your travel journey on an interactive world map.",
      content: (
        <div className="space-y-3 text-sm">
          <p>
            <strong>Click any country</strong> on the map to get started.
          </p>
          <p className="text-muted-foreground text-xs">
            💡 <strong>Mobile tip:</strong> Tap the menu (☰) for all features
          </p>
        </div>
      ),
    },
    {
      title: "Mark Countries as Visited ✨",
      description: "Track your travels with one click.",
      content: (
        <div className="space-y-3 text-sm">
          <p>
            <strong>Mark countries as visited</strong> and add <strong>notes, dates, and ratings</strong> to remember your adventures.
          </p>
          <p className="text-muted-foreground text-xs">
            💡 <strong>Mobile:</strong> Use the menu (☰) to access all features
          </p>
        </div>
      ),
    },
    {
      title: "Search & Explore 🔍",
      description: "Find any country instantly.",
      content: (
        <div className="space-y-3 text-sm">
          <p>
            <strong>Search for countries</strong> and the map will <strong>auto-zoom</strong> to your selection.
          </p>
          <p className="text-muted-foreground text-xs">
            💡 <strong>Mobile:</strong> Open the menu (☰) to search
          </p>
        </div>
      ),
    },
    {
      title: "Export & Share 📤",
      description: "Share your travel map with the world.",
      content: (
        <div className="space-y-3 text-sm">
          <p>
            <strong>Export high-resolution images</strong> or <strong>share instantly</strong> with friends and family.
          </p>
          <p className="text-muted-foreground text-xs">
            💡 <strong>Mobile:</strong> All features available in the menu (☰)
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  const currentStep = steps[step];

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center">
            {currentStep.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 px-1">{currentStep.content}</div>
        <div className="flex items-center justify-center gap-2 py-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step 
                  ? "bg-primary w-8" 
                  : "bg-muted w-2"
              }`}
            />
          ))}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip} className="flex-1 sm:flex-initial">
            Skip
          </Button>
          <Button onClick={handleNext} className="flex-1 sm:flex-initial">
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

