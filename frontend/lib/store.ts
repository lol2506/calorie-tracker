"use client";

import { create } from "zustand";
import * as api from "./api";
import type { Food, Meal, DayStats, UserProfile as BackendUserProfile } from "./api";

// =============================================================================
// Types
// =============================================================================

export type Goal = "lose" | "maintain" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";
export type Screen = "auth" | "onboarding" | "setup" | "home" | "add-food" | "history" | "insights" | "profile";

export interface LocalUserProfile {
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
  meal: MealType;
  timestamp: Date;
  portion?: string;
  // Backend-linked fields
  backendMealId?: number;
  foodId?: number;
  quantity?: number;
}

export interface DayData {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
}

interface AppState {
  // Navigation
  currentScreen: Screen;
  setupStep: number;
  isOnboarded: boolean;
  selectedMeal: MealType;

  // Local profile (from setup wizard)
  profile: LocalUserProfile | null;

  // Authentication
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  userEmail: string | null;
  backendProfile: BackendUserProfile | null;

  // Backend data
  backendFoods: Food[];
  todayMeals: Meal[];
  todayStats: DayStats | null;

  // Local entries (for offline/quick add)
  todayEntries: FoodEntry[];
  weekHistory: DayData[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // ==========================================================================
  // Navigation Actions
  // ==========================================================================
  setScreen: (screen: Screen) => void;
  setSetupStep: (step: number) => void;
  completeOnboarding: () => void;
  setProfile: (profile: LocalUserProfile) => void;
  setSelectedMeal: (meal: MealType) => void;

  // ==========================================================================
  // Authentication Actions
  // ==========================================================================
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, dailyCalorieGoal?: number) => Promise<void>;
  logout: () => void;

  // ==========================================================================
  // Backend Data Actions
  // ==========================================================================
  fetchFoods: (searchQuery?: string) => Promise<void>;
  fetchTodayData: () => Promise<void>;
  addMealToBackend: (foodId: number, mealType: MealType, quantity?: number) => Promise<void>;
  removeMealFromBackend: (mealId: number) => Promise<void>;

  // ==========================================================================
  // Local Entry Actions (for quick add / offline)
  // ==========================================================================
  addFoodEntry: (entry: Omit<FoodEntry, "id" | "timestamp">) => void;
  removeFoodEntry: (id: string) => void;

  // ==========================================================================
  // Utility Actions
  // ==========================================================================
  clearError: () => void;
}

// =============================================================================
// Helper Functions
// =============================================================================

export function calculateCalorieTarget(profile: Partial<LocalUserProfile>): number {
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

// Convert backend meal to local FoodEntry format
function mealToFoodEntry(meal: Meal): FoodEntry {
  return {
    id: `backend-${meal.id}`,
    name: meal.food.name,
    calories: meal.total_calories,
    meal: meal.meal_type,
    timestamp: new Date(meal.logged_at),
    portion: `${meal.quantity} ${meal.food.unit_type}`,
    backendMealId: meal.id,
    foodId: meal.food.id,
    quantity: meal.quantity,
  };
}

// =============================================================================
// Store
// =============================================================================

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentScreen: "auth",
  setupStep: 1,
  isOnboarded: false,
  selectedMeal: "breakfast",
  profile: null,

  isAuthenticated: false,
  isCheckingAuth: true,
  userEmail: null,
  backendProfile: null,

  backendFoods: [],
  todayMeals: [],
  todayStats: null,

  todayEntries: [],
  weekHistory: generateWeekHistory(),

  isLoading: false,
  error: null,

  // ==========================================================================
  // Navigation Actions
  // ==========================================================================

  setScreen: (screen) => set({ currentScreen: screen }),

  setSetupStep: (step) => set({ setupStep: step }),

  completeOnboarding: () => set({ isOnboarded: true, currentScreen: "setup" }),

  setProfile: (profile) => set({
    profile,
    currentScreen: "home",
    isOnboarded: true,
  }),

  setSelectedMeal: (meal) => set({ selectedMeal: meal }),

  // ==========================================================================
  // Authentication Actions
  // ==========================================================================

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const isValid = await api.validateToken();

      if (isValid) {
        const profile = await api.getProfile();
        set({
          isAuthenticated: true,
          userEmail: profile.email,
          backendProfile: profile,
          currentScreen: "onboarding",
          isCheckingAuth: false,
        });

        // Load initial data
        get().fetchTodayData();
        get().fetchFoods();
      } else {
        set({
          isAuthenticated: false,
          currentScreen: "auth",
          isCheckingAuth: false,
        });
      }
    } catch {
      set({
        isAuthenticated: false,
        currentScreen: "auth",
        isCheckingAuth: false,
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      await api.login(email, password);
      const profile = await api.getProfile();

      set({
        isAuthenticated: true,
        userEmail: email,
        backendProfile: profile,
        currentScreen: "onboarding",
        isLoading: false,
      });

      // Load initial data
      get().fetchTodayData();
      get().fetchFoods();
    } catch (err) {
      const error = err as api.ApiError;
      set({
        isLoading: false,
        error: error.message || "Login failed. Please try again.",
      });
      throw err;
    }
  },

  register: async (email, password, dailyCalorieGoal = 2000) => {
    set({ isLoading: true, error: null });

    try {
      await api.register(email, password, dailyCalorieGoal);
      const profile = await api.getProfile();

      set({
        isAuthenticated: true,
        userEmail: email,
        backendProfile: profile,
        currentScreen: "onboarding",
        isLoading: false,
      });

      // Load initial data
      get().fetchFoods();
    } catch (err) {
      const error = err as api.ApiError;
      set({
        isLoading: false,
        error: error.message || "Registration failed. Please try again.",
      });
      throw err;
    }
  },

  logout: () => {
    api.logout();
    set({
      isAuthenticated: false,
      userEmail: null,
      backendProfile: null,
      backendFoods: [],
      todayMeals: [],
      todayStats: null,
      todayEntries: [],
      currentScreen: "auth",
      isOnboarded: false,
      profile: null,
      setupStep: 1,
    });
  },

  // ==========================================================================
  // Backend Data Actions
  // ==========================================================================

  fetchFoods: async (searchQuery) => {
    set({ isLoading: true, error: null });

    try {
      const foods = searchQuery
        ? await api.searchFoods(searchQuery)
        : await api.getAllFoods();

      set({ backendFoods: foods, isLoading: false });
    } catch (err) {
      const error = err as api.ApiError;
      set({
        isLoading: false,
        error: error.message || "Failed to load foods.",
      });
    }
  },

  fetchTodayData: async () => {
    set({ isLoading: true, error: null });

    try {
      const [meals, stats] = await Promise.all([
        api.getTodayMeals(),
        api.getTodayStats(),
      ]);

      // Convert backend meals to local entries
      const entries = meals.map(mealToFoodEntry);

      set({
        todayMeals: meals,
        todayStats: stats,
        todayEntries: entries,
        isLoading: false,
      });
    } catch (err) {
      const error = err as api.ApiError;
      set({
        isLoading: false,
        error: error.message || "Failed to load today's data.",
      });
    }
  },

  addMealToBackend: async (foodId, mealType, quantity = 1) => {
    set({ isLoading: true, error: null });

    try {
      const meal = await api.logMeal(foodId, mealType, quantity);
      const entry = mealToFoodEntry(meal);

      set((state) => ({
        todayMeals: [...state.todayMeals, meal],
        todayEntries: [...state.todayEntries, entry],
        currentScreen: "home",
        isLoading: false,
      }));

      // Refresh stats
      get().fetchTodayData();
    } catch (err) {
      const error = err as api.ApiError;
      set({
        isLoading: false,
        error: error.message || "Failed to add meal.",
      });
      throw err;
    }
  },

  removeMealFromBackend: async (mealId) => {
    set({ isLoading: true, error: null });

    try {
      await api.deleteMeal(mealId);

      set((state) => ({
        todayMeals: state.todayMeals.filter((m) => m.id !== mealId),
        todayEntries: state.todayEntries.filter((e) => e.backendMealId !== mealId),
        isLoading: false,
      }));

      // Refresh stats
      get().fetchTodayData();
    } catch (err) {
      const error = err as api.ApiError;
      set({
        isLoading: false,
        error: error.message || "Failed to remove meal.",
      });
    }
  },

  // ==========================================================================
  // Local Entry Actions
  // ==========================================================================

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

  removeFoodEntry: (id) => set((state) => {
    const entry = state.todayEntries.find((e) => e.id === id);

    // If it's a backend meal, also remove from backend
    if (entry?.backendMealId) {
      get().removeMealFromBackend(entry.backendMealId);
    }

    return {
      todayEntries: state.todayEntries.filter((e) => e.id !== id),
    };
  }),

  // ==========================================================================
  // Utility Actions
  // ==========================================================================

  clearError: () => set({ error: null }),
}));

// Re-export types for convenience
export type { Food, Meal, DayStats };
