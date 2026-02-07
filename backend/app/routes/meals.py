from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from typing import List
from ..database import get_db
from ..models.meal import Meal
from ..models.food import Food
from ..models.user import User
from ..schemas.meal import MealCreate, MealResponse, DailyStatsResponse
from ..utils.dependencies import get_current_user

router = APIRouter(prefix="/meals", tags=["Meals"])


@router.post("", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
def create_meal(
    meal_data: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Log a meal
    """
    # Verify food exists
    food = db.query(Food).filter(Food.id == meal_data.food_id).first()
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )
    
    # Validate meal type
    valid_meal_types = ["breakfast", "lunch", "dinner", "snacks"]
    if meal_data.meal_type.lower() not in valid_meal_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Meal type must be one of: {', '.join(valid_meal_types)}"
        )
    
    # Create meal log
    new_meal = Meal(
        user_id=current_user.id,
        food_id=meal_data.food_id,
        meal_type=meal_data.meal_type.lower(),
        quantity=meal_data.quantity
    )
    
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    
    # Calculate total calories
    total_calories = food.calories_per_unit * meal_data.quantity
    
    # Prepare response
    response = MealResponse(
        id=new_meal.id,
        food=food,
        meal_type=new_meal.meal_type,
        quantity=new_meal.quantity,
        logged_at=new_meal.logged_at,
        total_calories=total_calories
    )
    
    return response


@router.get("/today", response_model=List[MealResponse])
def get_todays_meals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all meals logged today
    """
    today = date.today()
    meals = db.query(Meal).filter(
        Meal.user_id == current_user.id,
        func.date(Meal.logged_at) == today
    ).all()
    
    # Build response with calculated calories
    response = []
    for meal in meals:
        total_calories = meal.food.calories_per_unit * meal.quantity
        response.append(MealResponse(
            id=meal.id,
            food=meal.food,
            meal_type=meal.meal_type,
            quantity=meal.quantity,
            logged_at=meal.logged_at,
            total_calories=total_calories
        ))
    
    return response


@router.get("/stats/today", response_model=DailyStatsResponse)
def get_daily_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get today's calorie and nutrition statistics
    """
    today = date.today()
    meals = db.query(Meal).filter(
        Meal.user_id == current_user.id,
        func.date(Meal.logged_at) == today
    ).all()
    
    # Calculate totals
    total_calories = 0.0
    total_protein = 0.0
    total_carbs = 0.0
    total_fats = 0.0
    meals_by_type = {
        "breakfast": [],
        "lunch": [],
        "dinner": [],
        "snacks": []
    }
    
    for meal in meals:
        quantity = meal.quantity
        food = meal.food
        
        # Accumulate totals
        total_calories += food.calories_per_unit * quantity
        total_protein += food.protein_g * quantity
        total_carbs += food.carbs_g * quantity
        total_fats += food.fats_g * quantity
        
        # Group by meal type
        meal_info = {
            "id": meal.id,
            "food_name": food.name,
            "quantity": quantity,
            "unit": food.unit_type,
            "calories": food.calories_per_unit * quantity
        }
        meals_by_type[meal.meal_type].append(meal_info)
    
    # Calculate remaining calories
    remaining_calories = current_user.daily_calorie_goal - total_calories
    
    return DailyStatsResponse(
        total_calories=round(total_calories, 2),
        total_protein=round(total_protein, 2),
        total_carbs=round(total_carbs, 2),
        total_fats=round(total_fats, 2),
        daily_goal=current_user.daily_calorie_goal,
        remaining_calories=round(remaining_calories, 2),
        meals_by_type=meals_by_type
    )


@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a meal log
    """
    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.user_id == current_user.id
    ).first()
    
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found or unauthorized"
        )
    
    db.delete(meal)
    db.commit()
    
    return None
