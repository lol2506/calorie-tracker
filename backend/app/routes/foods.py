from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.food import Food
from ..models.user import User
from ..schemas.food import FoodResponse
from ..utils.dependencies import get_current_user

router = APIRouter(prefix="/foods", tags=["Foods"])


@router.get("", response_model=List[FoodResponse])
def get_foods(
    search: Optional[str] = Query(None, description="Search term to filter foods by name"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all foods with optional search filter
    """
    query = db.query(Food)
    
    # Apply search filter if provided
    if search:
        query = query.filter(Food.name.ilike(f"%{search}%"))
    
    foods = query.all()
    return foods
