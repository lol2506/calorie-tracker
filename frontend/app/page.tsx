"use client";

import { useAppStore } from "@/lib/store";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { SetupScreen } from "@/components/screens/setup-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { AddFoodScreen } from "@/components/screens/add-food-screen";
import { HistoryScreen } from "@/components/screens/history-screen";
import { InsightsScreen } from "@/components/screens/insights-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";

export default function App() {
  const { currentScreen } = useAppStore();

  return (
    <main className="max-w-md mx-auto min-h-screen">
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
