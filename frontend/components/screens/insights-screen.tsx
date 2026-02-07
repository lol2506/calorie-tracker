"use client";

import React from "react"

import { useAppStore } from "@/lib/store";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { 
  Moon, 
  TrendingUp, 
  Target, 
  Flame,
  Award,
  Utensils,
  Coffee,
  ArrowRight
} from "lucide-react";

interface InsightCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  type: "info" | "tip" | "achievement";
  value?: string;
}

export function InsightsScreen() {
  const { todayEntries, weekHistory, profile } = useAppStore();

  const dailyTarget = profile?.dailyCalorieTarget || 2000;

  // Calculate some basic insights
  const mealCounts = {
    breakfast: todayEntries.filter((e) => e.meal === "breakfast").length,
    lunch: todayEntries.filter((e) => e.meal === "lunch").length,
    snacks: todayEntries.filter((e) => e.meal === "snacks").length,
    dinner: todayEntries.filter((e) => e.meal === "dinner").length,
  };

  const mostLoggedMeal = Object.entries(mealCounts).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ["", 0]
  )[0];

  const weekCalories = weekHistory.map((d) => d.totalCalories);
  const avgCalories = Math.round(weekCalories.reduce((a, b) => a + b, 0) / 7);
  const maxCalories = Math.max(...weekCalories);
  const onTargetDays = weekCalories.filter(
    (c) => c > 0 && Math.abs(c - dailyTarget) <= 200
  ).length;

  const insights: InsightCard[] = [
    {
      id: "dinner",
      icon: Moon,
      title: "Dinner is your biggest meal",
      description: "Most of your calories come from dinner. Consider lighter evening meals if you want to reduce intake.",
      type: "info",
    },
    {
      id: "protein",
      icon: Target,
      title: "Try adding more protein",
      description: "Adding protein to breakfast can help you feel fuller longer and reduce snacking.",
      type: "tip",
    },
    {
      id: "streak",
      icon: Flame,
      title: "Keep it going!",
      description: `You've been on target for ${onTargetDays} days this week. Consistency is key to success.`,
      type: "achievement",
      value: `${onTargetDays}/7 days`,
    },
    {
      id: "average",
      icon: TrendingUp,
      title: "Your weekly average",
      description: `You're averaging ${avgCalories} calories per day. ${avgCalories < dailyTarget ? "You're under your goal - great for weight loss!" : "Right on track with your goals."}`,
      type: "info",
      value: `${avgCalories} cal/day`,
    },
    {
      id: "breakfast",
      icon: Coffee,
      title: "Don't skip breakfast",
      description: "A balanced breakfast helps maintain energy levels and prevents overeating later in the day.",
      type: "tip",
    },
    {
      id: "logging",
      icon: Utensils,
      title: "You're building great habits",
      description: `${mostLoggedMeal || "Lunch"} is your most consistently logged meal. Keep tracking!`,
      type: "achievement",
    },
  ];

  const tips = [
    "Drinking water before meals can help you feel full faster",
    "Eating slowly gives your brain time to register fullness",
    "Fiber-rich foods like vegetables keep you satisfied longer",
    "Small portions throughout the day beat large, infrequent meals",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Personalized tips and observations</p>
      </header>

      {/* Quick Tip Banner */}
      <div className="px-6 pb-6">
        <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Tip of the day</p>
              <p className="text-sm text-muted-foreground mt-1">{randomTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Your insights</h2>
        
        {insights.map((insight) => {
          const Icon = insight.icon;
          
          return (
            <div
              key={insight.id}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  insight.type === "achievement" 
                    ? "bg-primary/10 text-primary" 
                    : insight.type === "tip"
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground">{insight.title}</p>
                    {insight.value && (
                      <span className="text-sm font-medium text-primary shrink-0">
                        {insight.value}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* View More Link */}
        <button className="w-full p-4 bg-card rounded-2xl border border-border flex items-center justify-between text-left hover:border-primary/50 transition-colors">
          <span className="font-medium text-foreground">View all insights</span>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
