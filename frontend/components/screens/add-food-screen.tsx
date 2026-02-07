"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppStore, type Food, type MealType } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search, Camera, Zap, X, Loader2, Minus, Plus } from "lucide-react";

type Tab = "search" | "photo" | "quick";

const quickAddOptions = [
  { label: "Small meal", description: "Light snack, fruit", calories: 150 },
  { label: "Medium meal", description: "Regular portion", calories: 400 },
  { label: "Large meal", description: "Full plate", calories: 700 },
];

export function AddFoodScreen() {
  const {
    selectedMeal,
    setScreen,
    addFoodEntry,
    addMealToBackend,
    fetchFoods,
    backendFoods,
    isLoading,
    error,
    isAuthenticated,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch foods on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchFoods();
    }
  }, [isAuthenticated, fetchFoods]);

  // Debounced search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        fetchFoods(query || undefined);
      }, 300);

      setSearchTimeout(timeout);
    }
  }, [isAuthenticated, fetchFoods, searchTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleAddFood = async (food: Food) => {
    if (isAuthenticated) {
      setIsAddingMeal(true);
      try {
        await addMealToBackend(food.id, selectedMeal, quantity);
        setSelectedFood(null);
        setQuantity(1);
      } catch {
        // Error handled in store
      } finally {
        setIsAddingMeal(false);
      }
    } else {
      // Fallback to local entry for unauthenticated users
      addFoodEntry({
        name: food.name,
        calories: food.calories_per_unit * quantity,
        meal: selectedMeal,
        portion: `${quantity} ${food.unit_type}`,
      });
    }
  };

  const handleQuickAdd = (calories: number, label: string) => {
    addFoodEntry({
      name: label,
      calories,
      meal: selectedMeal,
    });
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
    setQuantity(1);
  };

  const mealLabels: Record<MealType, string> = {
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

  // Filter foods based on search query (client-side fallback)
  const displayedFoods = searchQuery && backendFoods.length === 0
    ? backendFoods
    : backendFoods;

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
                placeholder="Search Indian foods..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {/* Food List */}
            {!isLoading && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground px-1">
                  {searchQuery ? `Results for "${searchQuery}"` : `Indian Foods (${displayedFoods.length})`}
                </p>

                {displayedFoods.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchQuery ? "No foods found" : "No foods available"}
                    </p>
                  </div>
                ) : (
                  displayedFoods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className="w-full p-4 bg-card border border-border rounded-2xl flex items-center justify-between hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{food.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {food.unit_size_description}
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>P: {food.protein_g}g</span>
                          <span>C: {food.carbs_g}g</span>
                          <span>F: {food.fats_g}g</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-foreground">{food.calories_per_unit}</p>
                        <p className="text-xs text-muted-foreground">cal/{food.unit_type}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
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
          </div>
        )}
      </div>

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div
            className="w-full max-w-md bg-background rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{selectedFood.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedFood.unit_size_description}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="p-3 bg-muted rounded-xl text-center">
                <p className="text-lg font-bold text-foreground">{selectedFood.calories_per_unit * quantity}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div className="p-3 bg-muted rounded-xl text-center">
                <p className="text-lg font-bold text-foreground">{(selectedFood.protein_g * quantity).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="p-3 bg-muted rounded-xl text-center">
                <p className="text-lg font-bold text-foreground">{(selectedFood.carbs_g * quantity).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div className="p-3 bg-muted rounded-xl text-center">
                <p className="text-lg font-bold text-foreground">{(selectedFood.fats_g * quantity).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Quantity ({selectedFood.unit_type})</p>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                  className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-3xl font-bold text-foreground min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 0.5)}
                  className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleAddFood(selectedFood)}
              disabled={isAddingMeal}
              className={cn(
                "w-full h-14 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2",
                isAddingMeal
                  ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
              )}
            >
              {isAddingMeal ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add to ${mealLabels[selectedMeal]}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
