from pydantic import BaseModel


class FoodBase(BaseModel):
    """Base schema for food"""
    name: str
    calories_per_unit: float
    protein_g: float
    carbs_g: float
    fats_g: float
    unit_type: str
    unit_size_description: str


class FoodResponse(FoodBase):
    """Schema for food response"""
    id: int
    
    class Config:
        from_attributes = True
