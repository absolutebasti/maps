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
      title: "Welcome to MyMap!",
      description: "Track and visualize the countries you've visited on an interactive world map.",
      content: (
        <div className="space-y-2 text-sm">
          <p>Get started by clicking on any country on the map to select it.</p>
          <p className="font-medium mt-3">💡 Tip: On mobile, tap the menu icon (☰) to access search, country details, and all features!</p>
        </div>
      ),
    },
    {
      title: "Mark Countries as Visited",
      description: "Click a country and use the buttons to mark it as visited or not visited.",
      content: (
        <div className="space-y-2 text-sm">
          <p>You can also add notes, dates, ratings, and tags to remember your travels.</p>
          <p className="font-medium mt-3">💡 On mobile: The menu (☰) gives you access to search countries and manage your list.</p>
        </div>
      ),
    },
    {
      title: "Search & Explore",
      description: "Use the search to quickly find any country.",
      content: (
        <div className="space-y-2 text-sm">
          <p>The map will automatically zoom to countries you select from the search.</p>
          <p className="font-medium mt-3">💡 On mobile: Tap the menu icon (☰) in the header to open the search and other tools.</p>
        </div>
      ),
    },
    {
      title: "Export & Share",
      description: "Export your map as a PNG image or share it with friends.",
      content: (
        <div className="space-y-2 text-sm">
          <p>Use the Export button for high-resolution images, or Share to quickly share your map.</p>
          <p className="font-medium mt-3">💡 Remember: The menu icon (☰) on mobile contains all the features you need!</p>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{currentStep.content}</div>
        <div className="flex items-center justify-center gap-2 py-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

