"use client";

import React from "react"

import { useState } from "react";
import { useAppStore, calculateCalorieTarget, type Goal, type ActivityLevel } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Scale, Target, Activity, Check } from "lucide-react";

const TOTAL_STEPS = 3;

export function SetupScreen() {
  const { setupStep, setSetupStep, setProfile } = useAppStore();
  const [formData, setFormData] = useState({
    age: 25,
    height: 170,
    weight: 70,
    goal: "maintain" as Goal,
    activityLevel: "moderate" as ActivityLevel,
  });

  const handleNext = () => {
    if (setupStep < TOTAL_STEPS) {
      setSetupStep(setupStep + 1);
    } else {
      const dailyCalorieTarget = calculateCalorieTarget(formData);
      setProfile({ ...formData, dailyCalorieTarget });
    }
  };

  const handleBack = () => {
    if (setupStep > 1) {
      setSetupStep(setupStep - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {setupStep > 1 && (
          <button onClick={handleBack} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < setupStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          {setupStep}/{TOTAL_STEPS}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1">
        {setupStep === 1 && (
          <BasicDetailsStep formData={formData} setFormData={setFormData} />
        )}
        {setupStep === 2 && (
          <GoalSelectionStep formData={formData} setFormData={setFormData} />
        )}
        {setupStep === 3 && (
          <ActivityLevelStep formData={formData} setFormData={setFormData} />
        )}
      </div>

      {/* Continue button */}
      <Button
        onClick={handleNext}
        className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground mt-8"
      >
        {setupStep === TOTAL_STEPS ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Complete Setup
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}

interface StepProps {
  formData: {
    age: number;
    height: number;
    weight: number;
    goal: Goal;
    activityLevel: ActivityLevel;
  };
  setFormData: React.Dispatch<React.SetStateAction<StepProps["formData"]>>;
}

function BasicDetailsStep({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Scale className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Tell us about yourself</h2>
        <p className="text-muted-foreground">This helps us calculate your daily calorie target</p>
      </div>

      <div className="space-y-6">
        <NumberInput
          label="Age"
          value={formData.age}
          onChange={(v) => setFormData((p) => ({ ...p, age: v }))}
          unit="years"
          min={10}
          max={100}
        />
        <NumberInput
          label="Height"
          value={formData.height}
          onChange={(v) => setFormData((p) => ({ ...p, height: v }))}
          unit="cm"
          min={100}
          max={250}
        />
        <NumberInput
          label="Weight"
          value={formData.weight}
          onChange={(v) => setFormData((p) => ({ ...p, weight: v }))}
          unit="kg"
          min={30}
          max={300}
        />
      </div>
    </div>
  );
}

function GoalSelectionStep({ formData, setFormData }: StepProps) {
  const goals: { id: Goal; label: string; description: string }[] = [
    { id: "lose", label: "Lose Weight", description: "Create a calorie deficit" },
    { id: "maintain", label: "Maintain", description: "Stay at your current weight" },
    { id: "gain", label: "Gain Weight", description: "Build muscle and mass" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{"What's your goal?"}</h2>
        <p className="text-muted-foreground">{"We'll adjust your daily target accordingly"}</p>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setFormData((p) => ({ ...p, goal: goal.id }))}
            className={cn(
              "w-full p-5 rounded-2xl border-2 text-left transition-all",
              formData.goal === goal.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{goal.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  formData.goal === goal.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}
              >
                {formData.goal === goal.id && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityLevelStep({ formData, setFormData }: StepProps) {
  const levels: { id: ActivityLevel; label: string; description: string }[] = [
    { id: "sedentary", label: "Sedentary", description: "Little to no exercise" },
    { id: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
    { id: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
    { id: "active", label: "Active", description: "Hard exercise 6-7 days/week" },
    { id: "very-active", label: "Very Active", description: "Very hard exercise, physical job" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Activity level</h2>
        <p className="text-muted-foreground">How active are you on a typical week?</p>
      </div>

      <div className="space-y-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setFormData((p) => ({ ...p, activityLevel: level.id }))}
            className={cn(
              "w-full p-4 rounded-2xl border-2 text-left transition-all",
              formData.activityLevel === level.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{level.label}</p>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3",
                  formData.activityLevel === level.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}
              >
                {formData.activityLevel === level.id && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min: number;
  max: number;
}

function NumberInput({ label, value, onChange, unit, min, max }: NumberInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-2xl text-foreground hover:bg-muted transition-colors"
        >
          -
        </button>
        <div className="flex-1 text-center">
          <span className="text-4xl font-bold text-foreground">{value}</span>
          <span className="text-lg text-muted-foreground ml-2">{unit}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-2xl text-foreground hover:bg-muted transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
