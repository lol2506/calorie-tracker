"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { AuthScreen } from "@/components/screens/auth-screen";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { SetupScreen } from "@/components/screens/setup-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { AddFoodScreen } from "@/components/screens/add-food-screen";
import { HistoryScreen } from "@/components/screens/history-screen";
import { InsightsScreen } from "@/components/screens/insights-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { Loader2 } from "lucide-react";

export default function App() {
  const { currentScreen, checkAuth, isCheckingAuth } = useAppStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <main className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto min-h-screen">
      {currentScreen === "auth" && <AuthScreen />}
      {currentScreen === "onboarding" && <OnboardingScreen />}
      {currentScreen === "setup" && <SetupScreen />}
      {currentScreen === "home" && <HomeScreen />}
      {currentScreen === "add-food" && <AddFoodScreen />}
      {currentScreen === "history" && <HistoryScreen />}
      {currentScreen === "insights" && <InsightsScreen />}
      {currentScreen === "profile" && <ProfileScreen />}
    </main>
  );
}
