# 📋 Calorie Tracker API - Quick Reference

Base URL: `http://localhost:8000`

## 🔐 Authentication Endpoints

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "daily_calorie_goal": 2000
}

Response: { "access_token": "eyJ...", "token_type": "bearer" }
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}

Response: { "access_token": "eyJ...", "token_type": "bearer" }
```

## 👤 User Endpoints

### Get Current User Profile
```http
GET /users/me
Authorization: Bearer <token>

Response: {
  "id": 1,
  "email": "user@example.com",
  "daily_calorie_goal": 2000,
  "created_at": "2024-01-15T10:30:00"
}
```

## 🍽️ Food Endpoints

### Get All Foods
```http
GET /foods
Authorization: Bearer <token>

Response: [
  {
    "id": 1,
    "name": "Roti / Chapati",
    "calories_per_unit": 71,
    "protein_g": 3.0,
    "carbs_g": 15.0,
    "fats_g": 0.4,
    "unit_type": "piece",
    "unit_size_description": "1 medium roti (30g)"
  },
  ...
]
```

### Search Foods
```http
GET /foods?search=paneer
Authorization: Bearer <token>

Returns only foods matching "paneer"
```

## 🍴 Meal Endpoints

### Log a Meal
```http
POST /meals
Authorization: Bearer <token>
Content-Type: application/json

{
  "food_id": 1,
  "meal_type": "breakfast",
  "quantity": 2
}

meal_type options: "breakfast", "lunch", "dinner", "snacks"

Response: {
  "id": 1,
  "food": { ... },
  "meal_type": "breakfast",
  "quantity": 2,
  "logged_at": "2024-01-15T08:30:00",
  "total_calories": 142
}
```

### Get Today's Meals
```http
GET /meals/today
Authorization: Bearer <token>

Response: [
  {
    "id": 1,
    "food": { "name": "Roti / Chapati", ... },
    "meal_type": "breakfast",
    "quantity": 2,
    "logged_at": "2024-01-15T08:30:00",
    "total_calories": 142
  },
  ...
]
```

### Get Today's Statistics
```http
GET /meals/stats/today
Authorization: Bearer <token>

Response: {
  "total_calories": 1450.5,
  "total_protein": 45.2,
  "total_carbs": 180.5,
  "total_fats": 42.3,
  "daily_goal": 2000,
  "remaining_calories": 549.5,
  "meals_by_type": {
    "breakfast": [
      {
        "id": 1,
        "food_name": "Roti / Chapati",
        "quantity": 2,
        "unit": "piece",
        "calories": 142
      }
    ],
    "lunch": [],
    "dinner": [],
    "snacks": []
  }
}
```

### Delete a Meal
```http
DELETE /meals/{meal_id}
Authorization: Bearer <token>

Response: 204 No Content
```

## 🔑 Authentication Header Format

For all protected endpoints, include:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🥘 Available Indian Foods (52 total)

### Breads & Rice
- Roti/Chapati, Paratha, Aloo Paratha, Naan
- Steamed Rice, Jeera Rice, Biryani (Veg & Chicken)

### Dals
- Dal Tadka, Dal Makhani, Sambhar

### Paneer Dishes
- Paneer Butter Masala, Palak Paneer, Paneer Tikka, Shahi Paneer

### Vegetable Curries
- Aloo Gobi, Bhindi Masala, Baingan Bharta, Mix Veg
- Chana Masala/Chole, Rajma Masala

### Non-Veg
- Chicken Curry, Butter Chicken, Fish Curry, Mutton Curry

### Sides
- Raita, Papad, Pickle

### Snacks
- Samosa, Pakora, Vada Pav, Dhokla, Kachori
- Dosa, Masala Dosa, Idli, Uttapam, Poha, Upma

### Sweets
- Gulab Jamun, Jalebi, Rasgulla, Ladoo, Halwa
- Kheer, Barfi, Sandesh

### Beverages
- Lassi (Sweet & Salted), Chai, Buttermilk

## 📏 Indian Portion Sizes

- **katori** - Small/medium bowl
- **piece** - Individual item (roti, samosa, etc.)
- **cup** - Standard cup/glass
- **tablespoon** - 1 tablespoon serving

## 🛠️ Testing with curl

```bash
# 1. Sign up
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","daily_calorie_goal":2000}'

# 2. Save the token from response, then use it:
TOKEN="your-token-here"

# 3. Get foods
curl http://localhost:8000/foods \
  -H "Authorization: Bearer $TOKEN"

# 4. Log a meal
curl -X POST http://localhost:8000/meals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"food_id":1,"meal_type":"breakfast","quantity":2}'

# 5. Get today's stats
curl http://localhost:8000/meals/stats/today \
  -H "Authorization: Bearer $TOKEN"
```

## 🌐 Interactive Documentation

Visit http://localhost:8000/docs for Swagger UI where you can:
- Test all endpoints interactively
- See request/response formats
- Authorize with JWT token

---

**Quick Tip:** Use the Swagger UI at `/docs` - it's much easier than curl! 🚀
