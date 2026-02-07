"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function OnboardingScreen() {
  const { completeOnboarding, setScreen } = useAppStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {/* Logo and Branding */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Abstract shape / icon */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          {/* Decorative rings */}
          <div className="absolute -inset-4 rounded-full border border-primary/10 animate-pulse" />
          <div className="absolute -inset-8 rounded-full border border-primary/5" />
        </div>

        {/* App name and tagline */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Calora
          </h1>
          <p className="text-lg text-muted-foreground max-w-xs text-balance">
            Simple calorie tracking for a healthier you
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-col gap-3 mt-4">
          {[
            "Log meals in 2-3 taps",
            "Human-friendly portions",
            "Track your progress",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="w-full max-w-sm space-y-3 mt-auto">
        <Button
          onClick={completeOnboarding}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          Get Started
        </Button>
        <button
          onClick={() => {
            setScreen("home");
          }}
          className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
