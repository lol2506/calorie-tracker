"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Flame, Mail, Lock, Eye, EyeOff, Target, Loader2 } from "lucide-react";

type AuthMode = "login" | "register";

export function AuthScreen() {
    const { login, register, isLoading, error, clearError } = useAppStore();

    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dailyGoal, setDailyGoal] = useState("2000");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        setValidationError(null);
        clearError();

        if (!email.trim()) {
            setValidationError("Email is required");
            return false;
        }

        if (!validateEmail(email)) {
            setValidationError("Please enter a valid email address");
            return false;
        }

        if (!password) {
            setValidationError("Password is required");
            return false;
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters");
            return false;
        }

        if (mode === "register") {
            if (password !== confirmPassword) {
                setValidationError("Passwords do not match");
                return false;
            }

            const goalNum = parseInt(dailyGoal, 10);
            if (isNaN(goalNum) || goalNum < 1000 || goalNum > 5000) {
                setValidationError("Calorie goal must be between 1000 and 5000");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (mode === "login") {
                await login(email, password);
            } else {
                await register(email, password, parseInt(dailyGoal, 10));
            }
        } catch {
            // Error is handled in store
        }
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "register" : "login");
        setValidationError(null);
        clearError();
        setPassword("");
        setConfirmPassword("");
    };

    const displayError = validationError || error;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="px-6 pt-16 pb-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Flame className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Calorie Tracker
                </h1>
                <p className="text-muted-foreground">
                    {mode === "login"
                        ? "Welcome back! Sign in to continue"
                        : "Create an account to get started"}
                </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 px-6 pb-8">
                {/* Mode Toggle */}
                <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => mode !== "login" && toggleMode()}
                        className={cn(
                            "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                            mode === "login"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => mode !== "register" && toggleMode()}
                        className={cn(
                            "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                            mode === "register"
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Register
                    </button>
                </div>

                {/* Error Display */}
                {displayError && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                        <p className="text-destructive text-sm">{displayError}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Email Input */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            className="w-full h-14 pl-12 pr-12 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Register-only fields */}
                    {mode === "register" && (
                        <>
                            {/* Confirm Password */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                />
                            </div>

                            {/* Daily Calorie Goal */}
                            <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="number"
                                    placeholder="Daily calorie goal (e.g., 2000)"
                                    value={dailyGoal}
                                    onChange={(e) => setDailyGoal(e.target.value)}
                                    min="1000"
                                    max="5000"
                                    className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                />
                            </div>

                            <p className="text-xs text-muted-foreground px-1">
                                You can adjust your calorie goal later in the app settings.
                            </p>
                        </>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "w-full h-14 mt-6 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2",
                        isLoading
                            ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {mode === "login" ? "Signing in..." : "Creating account..."}
                        </>
                    ) : (
                        mode === "login" ? "Sign In" : "Create Account"
                    )}
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-primary font-medium hover:underline"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-primary font-medium hover:underline"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </form>

            {/* Bottom decoration */}
            <div className="px-6 pb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <p className="text-center text-xs text-muted-foreground mt-4">
                    Track your meals • Reach your goals • Stay healthy
                </p>
            </div>
        </div>
    );
}
