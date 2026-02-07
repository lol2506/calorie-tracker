"use client";

import { create } from "zustand";

export type Goal = "lose" | "maintain" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";

export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  dailyCalorieTarget: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  meal: "breakfast" | "lunch" | "snacks" | "dinner";
  timestamp: Date;
  portion?: string;
}

export interface DayData {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
}

interface AppState {
  currentScreen: "onboarding" | "setup" | "home" | "add-food" | "history" | "insights" | "profile";
  setupStep: number;
  isOnboarded: boolean;
  profile: UserProfile | null;
  todayEntries: FoodEntry[];
  weekHistory: DayData[];
  selectedMeal: "breakfast" | "lunch" | "snacks" | "dinner";
  
  // Actions
  setScreen: (screen: AppState["currentScreen"]) => void;
  setSetupStep: (step: number) => void;
  completeOnboarding: () => void;
  setProfile: (profile: UserProfile) => void;
  addFoodEntry: (entry: Omit<FoodEntry, "id" | "timestamp">) => void;
  removeFoodEntry: (id: string) => void;
  setSelectedMeal: (meal: FoodEntry["meal"]) => void;
}

// Calculate daily calorie target based on profile
export function calculateCalorieTarget(profile: Partial<UserProfile>): number {
  const { age, height, weight, goal, activityLevel } = profile;
  if (!age || !height || !weight || !goal || !activityLevel) return 2000;
  
  // Mifflin-St Jeor Equation (assuming male for simplicity)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  };
  
  const tdee = bmr * activityMultipliers[activityLevel];
  
  const goalAdjustments: Record<Goal, number> = {
    lose: -500,
    maintain: 0,
    gain: 300,
  };
  
  return Math.round(tdee + goalAdjustments[goal]);
}

// Generate mock week history
function generateWeekHistory(): DayData[] {
  const history: DayData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    const totalCalories = i === 0 ? 0 : Math.floor(Math.random() * 800) + 1400;
    
    history.push({
      date: dateStr,
      entries: [],
      totalCalories,
    });
  }
  
  return history;
}

export const useAppStore = create<AppState>((set) => ({
  currentScreen: "onboarding",
  setupStep: 1,
  isOnboarded: false,
  profile: null,
  todayEntries: [],
  weekHistory: generateWeekHistory(),
  selectedMeal: "breakfast",
  
  setScreen: (screen) => set({ currentScreen: screen }),
  setSetupStep: (step) => set({ setupStep: step }),
  completeOnboarding: () => set({ isOnboarded: true, currentScreen: "setup" }),
  
  setProfile: (profile) => set({ 
    profile, 
    currentScreen: "home",
    isOnboarded: true,
  }),
  
  addFoodEntry: (entry) => set((state) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    return { 
      todayEntries: [...state.todayEntries, newEntry],
      currentScreen: "home",
    };
  }),
  
  removeFoodEntry: (id) => set((state) => ({
    todayEntries: state.todayEntries.filter((e) => e.id !== id),
  })),
  
  setSelectedMeal: (meal) => set({ selectedMeal: meal }),
}));
