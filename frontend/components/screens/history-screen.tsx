"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BottomNavigation } from "@/components/ui/bottom-navigation";

export function HistoryScreen() {
  const { weekHistory, profile, todayEntries } = useAppStore();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const dailyTarget = profile?.dailyCalorieTarget || 2000;
  const today = new Date().toISOString().split("T")[0];

  // Update today's data in history
  const todayCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const historyWithToday = weekHistory.map((day) =>
    day.date === today ? { ...day, totalCalories: todayCalories, entries: todayEntries } : day
  );

  const getStatusColor = (calories: number) => {
    const ratio = calories / dailyTarget;
    if (ratio >= 1.1) return "bg-destructive";
    if (ratio >= 0.9) return "bg-primary";
    if (ratio >= 0.7) return "bg-warning";
    return "bg-muted-foreground/50";
  };

  const getStatusText = (calories: number) => {
    const diff = dailyTarget - calories;
    if (calories === 0) return "No data";
    if (diff > 200) return `${diff} under`;
    if (diff < -100) return `${Math.abs(diff)} over`;
    return "On target";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      isToday: dateStr === today,
    };
  };

  // Calculate weekly stats
  const totalWeekCalories = historyWithToday.reduce((sum, day) => sum + day.totalCalories, 0);
  const avgDailyCalories = Math.round(totalWeekCalories / 7);
  const daysOnTarget = historyWithToday.filter(
    (day) => day.totalCalories > 0 && Math.abs(day.totalCalories - dailyTarget) <= 200
  ).length;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground mt-1">Your weekly progress</p>
      </header>

      {/* Weekly Calendar Strip */}
      <div className="px-6 pb-6">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex justify-between gap-2">
            {historyWithToday.map((day) => {
              const { dayName, dayNumber, isToday } = formatDate(day.date);
              const ratio = day.totalCalories / dailyTarget;

              return (
                <button
                  key={day.date}
                  onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-2 px-1 rounded-xl transition-colors flex-1",
                    isToday && "bg-primary/10",
                    expandedDay === day.date && "ring-2 ring-primary"
                  )}
                >
                  <span className={cn(
                    "text-xs font-medium",
                    isToday ? "text-primary" : "text-muted-foreground"
                  )}>
                    {dayName}
                  </span>
                  <span className={cn(
                    "text-lg font-semibold",
                    isToday ? "text-primary" : "text-foreground"
                  )}>
                    {dayNumber}
                  </span>
                  {/* Progress indicator */}
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", getStatusColor(day.totalCalories))}
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Avg. Daily</p>
            <p className="text-2xl font-bold text-foreground mt-1">{avgDailyCalories}</p>
            <p className="text-xs text-muted-foreground">calories</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Days on Target</p>
            <p className="text-2xl font-bold text-foreground mt-1">{daysOnTarget}/7</p>
            <p className="text-xs text-muted-foreground">this week</p>
          </div>
        </div>
      </div>

      {/* Day Details */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Daily Breakdown</h2>
        
        {historyWithToday.slice().reverse().map((day) => {
          const { dayName, dayNumber, isToday } = formatDate(day.date);
          const isExpanded = expandedDay === day.date;
          const status = getStatusText(day.totalCalories);

          return (
            <div key={day.date} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex flex-col items-center justify-center",
                    isToday ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                  )}>
                    <span className="text-xs font-medium">{dayName}</span>
                    <span className="text-lg font-bold leading-none">{dayNumber}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {isToday ? "Today" : `${dayName}, ${dayNumber}`}
                    </p>
                    <p className={cn(
                      "text-sm",
                      status === "On target" ? "text-primary" :
                      status.includes("over") ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-foreground">{day.totalCalories}</p>
                    <p className="text-xs text-muted-foreground">/ {dailyTarget}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border px-4 py-3">
                  {day.entries.length > 0 ? (
                    <div className="space-y-2">
                      {day.entries.map((entry, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {entry.meal}: {entry.name}
                          </span>
                          <span className="text-foreground font-medium">{entry.calories} cal</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No meals logged for this day
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNavigation />
    </div>
  );
}
