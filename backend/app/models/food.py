from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from ..database import Base


class Food(Base):
    """Food model for Indian food database"""
    __tablename__ = "foods"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    calories_per_unit = Column(Float, nullable=False)
    protein_g = Column(Float, default=0.0)
    carbs_g = Column(Float, default=0.0)
    fats_g = Column(Float, default=0.0)
    unit_type = Column(String, nullable=False)  # katori, piece, cup, tablespoon, 100g
    unit_size_description = Column(String, nullable=False)  # e.g., "1 medium roti"
    
    # Relationships
    meals = relationship("Meal", back_populates="food")
