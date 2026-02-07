from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class User(Base):
    """User model for authentication and profile"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    daily_calorie_goal = Column(Integer, default=2000)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    meals = relationship("Meal", back_populates="user", cascade="all, delete-orphan")
