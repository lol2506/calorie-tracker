"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Home, CalendarDays, Lightbulb, User } from "lucide-react";

const navItems = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "history" as const, label: "History", icon: CalendarDays },
  { id: "insights" as const, label: "Insights", icon: Lightbulb },
  { id: "profile" as const, label: "Profile", icon: User },
];

export function BottomNavigation() {
  const { currentScreen, setScreen } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/40 px-6 pb-6 pt-3 safe-area-bottom z-30">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-quiet hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "text-primary")} />
              <span className={cn("text-xs", isActive ? "font-medium" : "font-normal")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
