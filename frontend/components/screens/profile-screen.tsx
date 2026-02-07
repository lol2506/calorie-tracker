"use client";

import { useAppStore } from "@/lib/store";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Target,
  Scale,
  Activity,
  Settings,
  HelpCircle,
  Bell,
  Moon,
  ChevronRight,
  LogOut,
  Mail
} from "lucide-react";

export function ProfileScreen() {
  const { profile, backendProfile, userEmail, logout, setScreen } = useAppStore();

  const goalLabels = {
    lose: "Lose Weight",
    maintain: "Maintain Weight",
    gain: "Gain Weight",
  };

  const activityLabels = {
    sedentary: "Sedentary",
    light: "Lightly Active",
    moderate: "Moderately Active",
    active: "Active",
    "very-active": "Very Active",
  };

  // Use backend daily goal if available, otherwise use local profile
  const dailyGoal = backendProfile?.daily_calorie_goal || profile?.dailyCalorieTarget || 2000;

  const profileStats = [
    {
      icon: Scale,
      label: "Current Weight",
      value: profile?.weight ? `${profile.weight} kg` : "Not set",
    },
    {
      icon: Target,
      label: "Daily Goal",
      value: `${dailyGoal} cal`,
    },
    {
      icon: Activity,
      label: "Activity Level",
      value: profile?.activityLevel ? activityLabels[profile.activityLevel] : "Not set",
    },
  ];

  const menuSections = [
    {
      title: "Goals",
      items: [
        {
          icon: Target,
          label: "Edit Goal",
          description: profile?.goal ? goalLabels[profile.goal] : "Set your goal",
          action: () => setScreen("setup"),
        },
        {
          icon: Scale,
          label: "Update Weight",
          description: profile?.weight ? `${profile.weight} kg` : "Add your weight",
          action: () => setScreen("setup"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Meal reminders",
          action: () => { },
        },
        {
          icon: Moon,
          label: "Appearance",
          description: "Dark mode",
          action: () => { },
        },
        {
          icon: Settings,
          label: "Units",
          description: "Metric (kg, cm)",
          action: () => { },
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & FAQ",
          description: "Get answers",
          action: () => { },
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </header>

      {/* Profile Card */}
      <div className="px-6 pb-6">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground">Your Profile</h2>
              {userEmail && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{userEmail}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile?.goal ? goalLabels[profile.goal] : "Set up your goals"}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
            {profileStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-muted mx-auto flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {section.title}
            </h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={cn(
                      "w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors",
                      index !== section.items.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full p-4 bg-card rounded-2xl border border-border flex items-center gap-4 text-left hover:border-destructive/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-destructive">Sign Out</p>
            <p className="text-sm text-muted-foreground">Log out of your account</p>
          </div>
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
