# Calorie Tracker API - Backend

FastAPI backend for a calorie tracking application focused on Indian foods. Provides RESTful API endpoints for user authentication, food database access, and meal logging.

## 🚀 Features

- **User Authentication** with JWT tokens
- **50+ Indian Foods** pre-populated with accurate nutritional data
- **Meal Logging** with breakfast, lunch, dinner, and snacks tracking
- **Daily Statistics** showing calorie intake vs goals
- **Indian Portion Sizes** (katori, piece, cup, etc.)
- **CORS Enabled** for frontend integration
- **PostgreSQL Database** for data persistence

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **PostgreSQL 14+** - See installation instructions below
- **pip** (comes with Python)

## 🗄️ PostgreSQL Installation (Windows)

### Step 1: Download PostgreSQL

1. Visit [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Download the Windows installer (recommended version: 14.x or higher)
3. Run the installer

### Step 2: Installation Steps

1. **Select Components**: Keep all default components selected
2. **Data Directory**: Use default location
3. **Set Password**: Create a strong password for the `postgres` superuser (remember this!)
4. **Port**: Use default port `5432`
5. **Locale**: Use default locale
6. Click "Next" through remaining steps and "Finish"

### Step 3: Verify Installation

Open Command Prompt and run:
```bash
psql --version
```

If not found, add PostgreSQL to PATH:
- Path usually: `C:\Program Files\PostgreSQL\14\bin`

### Step 4: Create Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin 4 (installed with PostgreSQL)
2. Connect to PostgreSQL server (use your password)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `calorie_tracker`
5. Click "Save"

**Option B: Using Command Line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE calorie_tracker;

# Exit
\q
```

## 🛠️ Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and update with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/calorie_tracker
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

**To generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Populate Database with Indian Foods

```bash
python scripts/populate_foods.py
```

This will add 50+ Indian foods to your database including:
- Staples: Roti, Rice, Naan, Paratha
- Dals: Tadka, Makhani, Sambhar
- Curries: Paneer dishes, Chicken, Fish, Vegetables
- Snacks: Samosa, Pakora, Dhokla, Dosa
- Sweets: Gulab Jamun, Jalebi, Ladoo
- Beverages: Lassi, Chai, Buttermilk

### 6. Start the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at: **`http://localhost:8000`**

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Authentication

#### POST `/auth/signup`
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "daily_calorie_goal": 2000
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### POST `/auth/login`
Login and get JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### User Management

#### GET `/users/me`
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "daily_calorie_goal": 2000,
  "created_at": "2024-01-15T10:30:00"
}
```

### Foods

#### GET `/foods`
Get all foods with optional search (requires authentication)

**Query Parameters:**
- `search` (optional): Filter foods by name

**Examples:**
```
GET /foods
GET /foods?search=roti
GET /foods?search=paneer
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Roti / Chapati",
    "calories_per_unit": 71,
    "protein_g": 3.0,
    "carbs_g": 15.0,
    "fats_g": 0.4,
    "unit_type": "piece",
    "unit_size_description": "1 medium roti (30g)"
  }
]
```

### Meals

#### POST `/meals`
Log a meal (requires authentication)

**Request:**
```json
{
  "food_id": 1,
  "meal_type": "breakfast",
  "quantity": 2
}
```

**Response:**
```json
{
  "id": 1,
  "food": {
    "id": 1,
    "name": "Roti / Chapati",
    "calories_per_unit": 71,
    ...
  },
  "meal_type": "breakfast",
  "quantity": 2,
  "logged_at": "2024-01-15T08:30:00",
  "total_calories": 142
}
```

#### GET `/meals/today`
Get all meals logged today (requires authentication)

**Response:**
```json
[
  {
    "id": 1,
    "food": {...},
    "meal_type": "breakfast",
    "quantity": 2,
    "logged_at": "2024-01-15T08:30:00",
    "total_calories": 142
  }
]
```

#### GET `/meals/stats/today`
Get today's nutrition statistics (requires authentication)

**Response:**
```json
{
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
    "lunch": [...],
    "dinner": [...],
    "snacks": [...]
  }
}
```

#### DELETE `/meals/{meal_id}`
Delete a meal log (requires authentication)

**Response:** 204 No Content

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

The token is obtained from `/auth/signup` or `/auth/login` endpoints.

## 🌐 CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

To add more origins, update the `.env` file:
```env
CORS_ORIGINS=["http://localhost:3000", "http://your-frontend-url:port"]
```

## 🧪 Testing the API

### Using curl (Command Line)

**Signup:**
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"daily_calorie_goal\":2000}"
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Get Foods (replace TOKEN with your JWT):**
```bash
curl http://localhost:8000/foods \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Swagger UI

Visit http://localhost:8000/docs for an interactive API testing interface.

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app with CORS
│   ├── config.py            # Settings
│   ├── database.py          # DB connection
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── food.py
│   │   └── meal.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── food.py
│   │   └── meal.py
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── foods.py
│   │   └── meals.py
│   └── utils/
│       ├── auth.py          # JWT & hashing
│       └── dependencies.py  # get_current_user
├── scripts/
│   └── populate_foods.py    # Populate Indian foods
├── requirements.txt
├── .env.example
└── .gitignore
```

## 🛠️ Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `hashed_password`: Bcrypt hashed password
- `daily_calorie_goal`: Target calories (default: 2000)
- `created_at`: Registration timestamp

### Foods Table
- `id`: Primary key
- `name`: Food name
- `calories_per_unit`: Calories per serving
- `protein_g`: Protein in grams
- `carbs_g`: Carbohydrates in grams
- `fats_g`: Fats in grams
- `unit_type`: Portion type (katori/piece/cup)
- `unit_size_description`: Description of serving size

### Meals Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `food_id`: Foreign key to foods
- `meal_type`: breakfast/lunch/dinner/snacks
- `quantity`: Number of servings
- `logged_at`: Timestamp

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `could not connect to server`

**Solution:**
1. Verify PostgreSQL is running
2. Check your DATABASE_URL in `.env`
3. Verify database exists: `psql -U postgres -l`

### Import Error: No module named 'app'

**Solution:**
Make sure you're in the `backend` directory and virtual environment is activated.

### CORS Error in Frontend

**Solution:**
Add your frontend URL to CORS_ORIGINS in `.env` file.

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project as needed!

---

**Happy Coding! 🚀**
