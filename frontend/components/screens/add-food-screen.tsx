"use client";

import React from "react"

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search, Camera, Zap, X } from "lucide-react";

type Tab = "search" | "photo" | "quick";

const quickAddOptions = [
  { label: "Small meal", description: "Light snack, fruit", calories: 150 },
  { label: "Medium meal", description: "Regular portion", calories: 400 },
  { label: "Large meal", description: "Full plate", calories: 700 },
];

const portionSizes = [
  "1 piece",
  "1 bowl",
  "1 plate",
  "Half portion",
  "1 cup",
  "1 roti",
  "2 slices",
];

const popularFoods = [
  { name: "Banana", calories: 105, portion: "1 medium" },
  { name: "Chicken Breast", calories: 165, portion: "100g" },
  { name: "Rice", calories: 130, portion: "1 bowl" },
  { name: "Roti / Chapati", calories: 70, portion: "1 piece" },
  { name: "Dal", calories: 150, portion: "1 bowl" },
  { name: "Egg", calories: 78, portion: "1 whole" },
  { name: "Apple", calories: 95, portion: "1 medium" },
  { name: "Toast with Butter", calories: 120, portion: "1 slice" },
  { name: "Coffee with Milk", calories: 50, portion: "1 cup" },
  { name: "Samosa", calories: 260, portion: "1 piece" },
  { name: "Paneer Curry", calories: 300, portion: "1 bowl" },
  { name: "Salad", calories: 100, portion: "1 bowl" },
];

export function AddFoodScreen() {
  const { selectedMeal, setScreen, addFoodEntry } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPortion, setSelectedPortion] = useState<string | null>(null);

  const filteredFoods = searchQuery
    ? popularFoods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularFoods;

  const handleAddFood = (name: string, calories: number, portion?: string) => {
    addFoodEntry({
      name,
      calories,
      meal: selectedMeal,
      portion,
    });
  };

  const handleQuickAdd = (calories: number, label: string) => {
    addFoodEntry({
      name: label,
      calories,
      meal: selectedMeal,
    });
  };

  const mealLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    snacks: "Snacks",
    dinner: "Dinner",
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "search", label: "Search", icon: Search },
    { id: "photo", label: "Photo", icon: Camera },
    { id: "quick", label: "Quick Add", icon: Zap },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => setScreen("home")}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-xl"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add Food</h1>
          <p className="text-sm text-muted-foreground">{mealLabels[selectedMeal]}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {activeTab === "search" && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Food List */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground px-1">
                {searchQuery ? "Results" : "Popular foods"}
              </p>
              {filteredFoods.map((food, index) => (
                <button
                  key={index}
                  onClick={() => handleAddFood(food.name, food.calories, food.portion)}
                  className="w-full p-4 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-primary/50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-foreground">{food.name}</p>
                    <p className="text-sm text-muted-foreground">{food.portion}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{food.calories}</p>
                    <p className="text-xs text-muted-foreground">cal</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "photo" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-6">
              <Camera className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-xs">
              Photo recognition will let you snap a picture of your meal to log it instantly
            </p>
          </div>
        )}

        {activeTab === "quick" && (
          <div className="space-y-6">
            {/* Quick Add Buttons */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Estimate your meal size</p>
              {quickAddOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleQuickAdd(option.calories, option.label)}
                  className="w-full p-5 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{option.calories}</p>
                    <p className="text-xs text-muted-foreground">calories</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Portion Sizes */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Or select a portion size</p>
              <div className="flex flex-wrap gap-2">
                {portionSizes.map((portion) => (
                  <button
                    key={portion}
                    onClick={() => setSelectedPortion(selectedPortion === portion ? null : portion)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      selectedPortion === portion
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {portion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
