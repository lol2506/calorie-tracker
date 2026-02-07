"use client";

// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://calorie-tracker-api-tvbf.onrender.com";

// =============================================================================
// Types
// =============================================================================

export interface Food {
    id: number;
    name: string;
    calories_per_unit: number;
    protein_g: number;
    carbs_g: number;
    fats_g: number;
    unit_type: string;
    unit_size_description: string;
}

export interface Meal {
    id: number;
    food: Food;
    meal_type: "breakfast" | "lunch" | "dinner" | "snacks";
    quantity: number;
    logged_at: string;
    total_calories: number;
}

export interface MealSummary {
    id: number;
    food_name: string;
    quantity: number;
    unit: string;
    calories: number;
}

export interface DayStats {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fats: number;
    daily_goal: number;
    remaining_calories: number;
    meals_by_type: {
        breakfast: MealSummary[];
        lunch: MealSummary[];
        dinner: MealSummary[];
        snacks: MealSummary[];
    };
}

export interface UserProfile {
    id: number;
    email: string;
    daily_calorie_goal: number;
    created_at: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface ApiError {
    message: string;
    status: number;
}

// =============================================================================
// Token Management
// =============================================================================

const TOKEN_KEY = "calorie_tracker_token";

export function getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
}

// =============================================================================
// API Request Helper
// =============================================================================

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getStoredToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkError) {
        // Network error - could be CORS, connection refused, or offline
        console.error("Network error:", networkError);
        const error: ApiError = {
            message: "Unable to connect to server. The backend may be starting up (wait 30s and retry) or there's a network issue.",
            status: 0,
        };
        throw error;
    }

    if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }

        // Add helpful context for common errors
        if (response.status === 500) {
            errorMessage = "Server error. The backend may have a database issue. Please try again later.";
        } else if (response.status === 401) {
            errorMessage = "Invalid email or password.";
        } else if (response.status === 400 && errorMessage.includes("already registered")) {
            errorMessage = "This email is already registered. Please login instead.";
        }

        const error: ApiError = {
            message: errorMessage,
            status: response.status,
        };
        throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// =============================================================================
// Authentication API
// =============================================================================

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    setStoredToken(response.access_token);
    return response;
}

export async function register(
    email: string,
    password: string,
    dailyCalorieGoal: number = 2000
): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
            daily_calorie_goal: dailyCalorieGoal,
        }),
    });

    setStoredToken(response.access_token);
    return response;
}

export function logout(): void {
    removeStoredToken();
}

// =============================================================================
// User API
// =============================================================================

export async function getProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>("/users/me");
}

// =============================================================================
// Foods API
// =============================================================================

export async function getAllFoods(): Promise<Food[]> {
    return apiRequest<Food[]>("/foods");
}

export async function searchFoods(query: string): Promise<Food[]> {
    const encodedQuery = encodeURIComponent(query);
    return apiRequest<Food[]>(`/foods?search=${encodedQuery}`);
}

// =============================================================================
// Meals API
// =============================================================================

export async function logMeal(
    foodId: number,
    mealType: "breakfast" | "lunch" | "dinner" | "snacks",
    quantity: number = 1
): Promise<Meal> {
    return apiRequest<Meal>("/meals", {
        method: "POST",
        body: JSON.stringify({
            food_id: foodId,
            meal_type: mealType,
            quantity,
        }),
    });
}

export async function getTodayMeals(): Promise<Meal[]> {
    return apiRequest<Meal[]>("/meals/today");
}

export async function getTodayStats(): Promise<DayStats> {
    return apiRequest<DayStats>("/meals/stats/today");
}

export async function deleteMeal(mealId: number): Promise<void> {
    await apiRequest<void>(`/meals/${mealId}`, {
        method: "DELETE",
    });
}

// =============================================================================
// API Health Check
// =============================================================================

export async function checkApiHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/docs`);
        return response.ok;
    } catch {
        return false;
    }
}

// =============================================================================
// Validate Token
// =============================================================================

export async function validateToken(): Promise<boolean> {
    const token = getStoredToken();
    if (!token) return false;

    try {
        await getProfile();
        return true;
    } catch {
        removeStoredToken();
        return false;
    }
}
