from pydantic import BaseModel
from datetime import datetime
from typing import Dict
from .food import FoodResponse


class MealCreate(BaseModel):
    """Schema for creating a meal log"""
    food_id: int
    meal_type: str  # breakfast, lunch, dinner, snacks
    quantity: float


class MealResponse(BaseModel):
    """Schema for meal response"""
    id: int
    food: FoodResponse
    meal_type: str
    quantity: float
    logged_at: datetime
    total_calories: float
    
    class Config:
        from_attributes = True


class DailyStatsResponse(BaseModel):
    """Schema for daily statistics"""
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float
    daily_goal: int
    remaining_calories: float
    meals_by_type: Dict[str, list]
