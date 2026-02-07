from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class Meal(Base):
    """Meal logging model"""
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=False)
    meal_type = Column(String, nullable=False)  # breakfast, lunch, dinner, snacks
    quantity = Column(Float, nullable=False)  # Number of servings
    logged_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="meals")
    food = relationship("Food", back_populates="meals")
