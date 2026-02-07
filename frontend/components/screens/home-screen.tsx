"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Plus, Coffee, Sun, Cookie, Moon } from "lucide-react";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CalorieRing } from "@/components/ui/calorie-ring";
import { AnimatedDotsBackground } from "@/components/ui/animated-dots-background";

export function HomeScreen() {
  const { profile, todayEntries, setScreen, setSelectedMeal } = useAppStore();
  
  const dailyTarget = profile?.dailyCalorieTarget || 2000;
  const consumed = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const remaining = Math.max(0, dailyTarget - consumed);
  const progress = Math.min(1, consumed / dailyTarget);

  const meals = [
    { id: "breakfast" as const, label: "Breakfast", icon: Coffee, time: "7:00 - 10:00" },
    { id: "lunch" as const, label: "Lunch", icon: Sun, time: "12:00 - 14:00" },
    { id: "snacks" as const, label: "Snacks", icon: Cookie, time: "Any time" },
    { id: "dinner" as const, label: "Dinner", icon: Moon, time: "18:00 - 21:00" },
  ];

  const getMealCalories = (mealId: string) => {
    return todayEntries
      .filter((entry) => entry.meal === mealId)
      .reduce((sum, entry) => sum + entry.calories, 0);
  };

  const getMealEntries = (mealId: string) => {
    return todayEntries.filter((entry) => entry.meal === mealId);
  };

  const handleAddFood = (mealId: "breakfast" | "lunch" | "snacks" | "dinner") => {
    setSelectedMeal(mealId);
    setScreen("add-food");
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", { 
    weekday: "long", 
    month: "short", 
    day: "numeric" 
  });

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      <AnimatedDotsBackground />
      
      {/* Header */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <p className="text-whisper">{formattedDate}</p>
        <h1 className="text-2xl font-semibold text-foreground mt-1">Today</h1>
      </header>

      {/* Calorie Summary */}
      <div className="px-6 pb-8 relative z-10">
        <div className="card-crafted p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-whisper mb-1">Remaining</p>
              <p className="calorie-hero">
                {remaining.toLocaleString()}
              </p>
              <p className="text-quiet text-sm mt-1">calories</p>
              
              <div className="flex items-center gap-4 mt-5 text-sm">
                <div>
                  <span className="text-whisper">Goal </span>
                  <span className="text-quiet font-medium">{dailyTarget.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-border/50" />
                <div>
                  <span className="text-whisper">Eaten </span>
                  <span className="text-quiet font-medium">{consumed.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <CalorieRing progress={progress} consumed={consumed} />
          </div>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="px-6 space-y-3 relative z-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Meals</h2>
        
        {meals.map((meal) => {
          const calories = getMealCalories(meal.id);
          const entries = getMealEntries(meal.id);
          const Icon = meal.icon;

          return (
            <div
              key={meal.id}
              className="card-soft overflow-hidden"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{meal.label}</p>
                  <p className="text-whisper text-sm">
                    {calories > 0 ? `${calories} cal` : meal.time}
                  </p>
                </div>

                <button
                  onClick={() => handleAddFood(meal.id)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    calories > 0
                      ? "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Logged entries */}
              {entries.length > 0 && (
                <div className="border-t border-border/40 px-4 py-3 space-y-2">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between text-sm">
                      <span className="text-quiet truncate mr-2">
                        {entry.name}
                        {entry.portion && <span className="text-whisper"> ({entry.portion})</span>}
                      </span>
                      <span className="text-foreground/80 font-medium shrink-0">{entry.calories} cal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => handleAddFood("snacks")}
        className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      <BottomNavigation />
    </div>
  );
}
