"""
Script to populate the database with Indian foods
Run this after setting up the database
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.food import Food

# Create tables
Base.metadata.create_all(bind=engine)

# Indian foods data with accurate nutritional information
INDIAN_FOODS = [
    # STAPLES (Breads & Rice)
    {
        "name": "Roti / Chapati",
        "calories_per_unit": 71,
        "protein_g": 3.0,
        "carbs_g": 15.0,
        "fats_g": 0.4,
        "unit_type": "piece",
        "unit_size_description": "1 medium roti (30g)"
    },
    {
        "name": "Paratha (plain)",
        "calories_per_unit": 126,
        "protein_g": 3.0,
        "carbs_g": 18.0,
        "fats_g": 5.0,
        "unit_type": "piece",
        "unit_size_description": "1 medium paratha (40g)"
    },
    {
        "name": "Aloo Paratha",
        "calories_per_unit": 210,
        "protein_g": 4.5,
        "carbs_g": 27.0,
        "fats_g": 9.0,
        "unit_type": "piece",
        "unit_size_description": "1 stuffed paratha (100g)"
    },
    {
        "name": "Naan",
        "calories_per_unit": 262,
        "protein_g": 8.0,
        "carbs_g": 45.0,
        "fats_g": 5.0,
        "unit_type": "piece",
        "unit_size_description": "1 naan (90g)"
    },
    {
        "name": "Steamed Rice",
        "calories_per_unit": 130,
        "protein_g": 2.7,
        "carbs_g": 28.0,
        "fats_g": 0.3,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (100g)"
    },
    {
        "name": "Jeera Rice",
        "calories_per_unit": 180,
        "protein_g": 3.5,
        "carbs_g": 32.0,
        "fats_g": 4.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (120g)"
    },
    {
        "name": "Biryani (Veg)",
        "calories_per_unit": 280,
        "protein_g": 6.0,
        "carbs_g": 45.0,
        "fats_g": 8.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (200g)"
    },
    {
        "name": "Biryani (Chicken)",
        "calories_per_unit": 350,
        "protein_g": 20.0,
        "carbs_g": 42.0,
        "fats_g": 10.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (200g)"
    },
    
    # DAL (Lentils)
    {
        "name": "Dal Tadka",
        "calories_per_unit": 120,
        "protein_g": 6.0,
        "carbs_g": 18.0,
        "fats_g": 2.5,
        "unit_type": "katori",
        "unit_size_description": "1 small katori (150ml)"
    },
    {
        "name": "Dal Makhani",
        "calories_per_unit": 180,
        "protein_g": 7.0,
        "carbs_g": 20.0,
        "fats_g": 8.0,
        "unit_type": "katori",
        "unit_size_description": "1 small katori (150ml)"
    },
    {
        "name": "Sambhar",
        "calories_per_unit": 100,
        "protein_g": 5.0,
        "carbs_g": 15.0,
        "fats_g": 2.0,
        "unit_type": "katori",
        "unit_size_description": "1 small katori (150ml)"
    },
    
    # PANEER DISHES
    {
        "name": "Paneer Butter Masala",
        "calories_per_unit": 265,
        "protein_g": 12.0,
        "carbs_g": 10.0,
        "fats_g": 20.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Palak Paneer",
        "calories_per_unit": 210,
        "protein_g": 11.0,
        "carbs_g": 8.0,
        "fats_g": 15.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Paneer Tikka",
        "calories_per_unit": 180,
        "protein_g": 14.0,
        "carbs_g": 6.0,
        "fats_g": 12.0,
        "unit_type": "piece",
        "unit_size_description": "4-5 pieces (100g)"
    },
    {
        "name": "Shahi Paneer",
        "calories_per_unit": 280,
        "protein_g": 10.0,
        "carbs_g": 12.0,
        "fats_g": 22.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    
    # VEGETABLE CURRIES
    {
        "name": "Aloo Gobi",
        "calories_per_unit": 150,
        "protein_g": 3.0,
        "carbs_g": 22.0,
        "fats_g": 6.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Bhindi Masala",
        "calories_per_unit": 110,
        "protein_g": 2.5,
        "carbs_g": 12.0,
        "fats_g": 6.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (100g)"
    },
    {
        "name": "Baingan Bharta",
        "calories_per_unit": 130,
        "protein_g": 2.0,
        "carbs_g": 15.0,
        "fats_g": 7.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Mix Veg Curry",
        "calories_per_unit": 140,
        "protein_g": 4.0,
        "carbs_g": 18.0,
        "fats_g": 6.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Chana Masala / Chole",
        "calories_per_unit": 160,
        "protein_g": 8.0,
        "carbs_g": 24.0,
        "fats_g": 4.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Rajma Masala",
        "calories_per_unit": 155,
        "protein_g": 9.0,
        "carbs_g": 23.0,
        "fats_g": 3.5,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    
    # NON-VEG DISHES
    {
        "name": "Chicken Curry",
        "calories_per_unit": 220,
        "protein_g": 25.0,
        "carbs_g": 8.0,
        "fats_g": 10.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Butter Chicken",
        "calories_per_unit": 290,
        "protein_g": 23.0,
        "carbs_g": 10.0,
        "fats_g": 18.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Fish Curry",
        "calories_per_unit": 180,
        "protein_g": 20.0,
        "carbs_g": 6.0,
        "fats_g": 9.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Mutton Curry",
        "calories_per_unit": 310,
        "protein_g": 22.0,
        "carbs_g": 8.0,
        "fats_g": 22.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    
    # SIDES & ACCOMPANIMENTS
    {
        "name": "Raita (Cucumber)",
        "calories_per_unit": 60,
        "protein_g": 2.5,
        "carbs_g": 6.0,
        "fats_g": 3.0,
        "unit_type": "katori",
        "unit_size_description": "1 small katori (100g)"
    },
    {
        "name": "Papad (roasted)",
        "calories_per_unit": 40,
        "protein_g": 1.5,
        "carbs_g": 6.0,
        "fats_g": 1.2,
        "unit_type": "piece",
        "unit_size_description": "1 papad (10g)"
    },
    {
        "name": "Pickle (Achar)",
        "calories_per_unit": 25,
        "protein_g": 0.5,
        "carbs_g": 3.0,
        "fats_g": 1.5,
        "unit_type": "tablespoon",
        "unit_size_description": "1 tablespoon (15g)"
    },
    
    # SNACKS
    {
        "name": "Samosa",
        "calories_per_unit": 262,
        "protein_g": 5.0,
        "carbs_g": 32.0,
        "fats_g": 13.0,
        "unit_type": "piece",
        "unit_size_description": "1 medium samosa (100g)"
    },
    {
        "name": "Pakora / Bhajiya",
        "calories_per_unit": 180,
        "protein_g": 4.0,
        "carbs_g": 18.0,
        "fats_g": 10.0,
        "unit_type": "piece",
        "unit_size_description": "5-6 pieces (100g)"
    },
    {
        "name": "Vada Pav",
        "calories_per_unit": 290,
        "protein_g": 7.0,
        "carbs_g": 40.0,
        "fats_g": 12.0,
        "unit_type": "piece",
        "unit_size_description": "1 vada pav (120g)"
    },
    {
        "name": "Dhokla",
        "calories_per_unit": 160,
        "protein_g": 5.0,
        "carbs_g": 28.0,
        "fats_g": 3.0,
        "unit_type": "piece",
        "unit_size_description": "2 pieces (100g)"
    },
    {
        "name": "Kachori",
        "calories_per_unit": 230,
        "protein_g": 5.0,
        "carbs_g": 28.0,
        "fats_g": 11.0,
        "unit_type": "piece",
        "unit_size_description": "1 kachori (80g)"
    },
    {
        "name": "Dosa (plain)",
        "calories_per_unit": 168,
        "protein_g": 4.0,
        "carbs_g": 28.0,
        "fats_g": 4.0,
        "unit_type": "piece",
        "unit_size_description": "1 medium dosa (100g)"
    },
    {
        "name": "Masala Dosa",
        "calories_per_unit": 240,
        "protein_g": 6.0,
        "carbs_g": 38.0,
        "fats_g": 7.0,
        "unit_type": "piece",
        "unit_size_description": "1 dosa with filling (150g)"
    },
    {
        "name": "Idli",
        "calories_per_unit": 39,
        "protein_g": 2.0,
        "carbs_g": 8.0,
        "fats_g": 0.1,
        "unit_type": "piece",
        "unit_size_description": "1 idli (30g)"
    },
    {
        "name": "Uttapam",
        "calories_per_unit": 190,
        "protein_g": 5.0,
        "carbs_g": 32.0,
        "fats_g": 4.0,
        "unit_type": "piece",
        "unit_size_description": "1 uttapam (120g)"
    },
    {
        "name": "Poha",
        "calories_per_unit": 180,
        "protein_g": 3.0,
        "carbs_g": 32.0,
        "fats_g": 5.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    {
        "name": "Upma",
        "calories_per_unit": 200,
        "protein_g": 4.0,
        "carbs_g": 35.0,
        "fats_g": 5.0,
        "unit_type": "katori",
        "unit_size_description": "1 medium katori (150g)"
    },
    
    # SWEETS
    {
        "name": "Gulab Jamun",
        "calories_per_unit": 175,
        "protein_g": 3.0,
        "carbs_g": 28.0,
        "fats_g": 6.0,
        "unit_type": "piece",
        "unit_size_description": "1 gulab jamun (50g)"
    },
    {
        "name": "Jalebi",
        "calories_per_unit": 150,
        "protein_g": 1.0,
        "carbs_g": 32.0,
        "fats_g": 3.0,
        "unit_type": "piece",
        "unit_size_description": "2-3 pieces (50g)"
    },
    {
        "name": "Rasgulla",
        "calories_per_unit": 106,
        "protein_g": 4.0,
        "carbs_g": 21.0,
        "fats_g": 1.0,
        "unit_type": "piece",
        "unit_size_description": "1 rasgulla (50g)"
    },
    {
        "name": "Ladoo (Besan)",
        "calories_per_unit": 185,
        "protein_g": 4.0,
        "carbs_g": 24.0,
        "fats_g": 8.0,
        "unit_type": "piece",
        "unit_size_description": "1 ladoo (40g)"
    },
    {
        "name": "Halwa (Gajar/Carrot)",
        "calories_per_unit": 220,
        "protein_g": 3.0,
        "carbs_g": 35.0,
        "fats_g": 8.0,
        "unit_type": "katori",
        "unit_size_description": "1 small katori (100g)"
    },
    {
        "name": "Kheer",
        "calories_per_unit": 140,
        "protein_g": 4.0,
        "carbs_g": 24.0,
        "fats_g": 3.5,
        "unit_type": "katori",
        "unit_size_description": "1 small katori (100ml)"
    },
    {
        "name": "Barfi",
        "calories_per_unit": 150,
        "protein_g": 3.5,
        "carbs_g": 22.0,
        "fats_g": 5.5,
        "unit_type": "piece",
        "unit_size_description": "1 piece (40g)"
    },
    {
        "name": "Sandesh",
        "calories_per_unit": 120,
        "protein_g": 5.0,
        "carbs_g": 18.0,
        "fats_g": 3.0,
        "unit_type": "piece",
        "unit_size_description": "1 piece (50g)"
    },
    
    # BEVERAGES
    {
        "name": "Lassi (Sweet)",
        "calories_per_unit": 150,
        "protein_g": 6.0,
        "carbs_g": 24.0,
        "fats_g": 3.0,
        "unit_type": "cup",
        "unit_size_description": "1 glass (200ml)"
    },
    {
        "name": "Lassi (Salted)",
        "calories_per_unit": 90,
        "protein_g": 6.0,
        "carbs_g": 10.0,
        "fats_g": 3.0,
        "unit_type": "cup",
        "unit_size_description": "1 glass (200ml)"
    },
    {
        "name": "Chai (with milk & sugar)",
        "calories_per_unit": 70,
        "protein_g": 2.0,
        "carbs_g": 12.0,
        "fats_g": 1.5,
        "unit_type": "cup",
        "unit_size_description": "1 cup (150ml)"
    },
    {
        "name": "Buttermilk (Chaas)",
        "calories_per_unit": 40,
        "protein_g": 2.0,
        "carbs_g": 5.0,
        "fats_g": 1.0,
        "unit_type": "cup",
        "unit_size_description": "1 glass (200ml)"
    },
]


def populate_foods():
    """Populate the database with Indian foods"""
    db = SessionLocal()
    
    try:
        # Check if foods already exist
        existing_count = db.query(Food).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} foods.")
            response = input("Do you want to add more foods? (y/n): ")
            if response.lower() != 'y':
                print("Exiting without changes.")
                return
        
        # Add foods to database
        foods_added = 0
        for food_data in INDIAN_FOODS:
            # Check if food already exists
            existing_food = db.query(Food).filter(Food.name == food_data["name"]).first()
            if existing_food:
                print(f"Skipping '{food_data['name']}' - already exists")
                continue
            
            food = Food(**food_data)
            db.add(food)
            foods_added += 1
            print(f"Added: {food_data['name']}")
        
        db.commit()
        print(f"\n✅ Successfully added {foods_added} Indian foods to the database!")
        print(f"Total foods in database: {db.query(Food).count()}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Indian Foods Database Population Script")
    print("=" * 60)
    print(f"\nThis will add {len(INDIAN_FOODS)} Indian foods to your database.\n")
    populate_foods()
