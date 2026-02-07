# 🎉 Calorie Tracker Backend - Setup Complete!

## ✅ What's Been Built

Your FastAPI backend is now fully functional with:

### Core Features
- ✅ **User Authentication** - JWT-based signup/login
- ✅ **52 Indian Foods** - Pre-populated database ready to use
- ✅ **Meal Logging** - Track breakfast, lunch, dinner, snacks
- ✅ **Daily Statistics** - Real-time calorie tracking
- ✅ **Indian Portions** - Katori, piece, cup measurements
- ✅ **CORS Enabled** - Ready for your frontend

### API Endpoints (8 total)
1. `POST /auth/signup` - Register new user
2. `POST /auth/login` - Login and get JWT
3. `GET /users/me` - Get user profile
4. `GET /foods` - Search Indian foods
5. `POST /meals` - Log a meal
6. `GET /meals/today` - Today's meals
7. `GET /meals/stats/today` - Daily nutrition stats
8. `DELETE /meals/{id}` - Delete meal log

## 🚀 Next Steps

### 1. Install PostgreSQL (if not already installed)
See the detailed instructions in `README.md` under "PostgreSQL Installation"

### 2. Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and set your PostgreSQL password
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/calorie_tracker
```

### 3. Create PostgreSQL Database

**Option A - Using pgAdmin:**
- Open pgAdmin
- Create new database named `calorie_tracker`

**Option B - Using Command Line:**
```bash
psql -U postgres
CREATE DATABASE calorie_tracker;
\q
```

### 4. Populate Indian Foods

```bash
python scripts/populate_foods.py
```

This adds 52 Indian foods including:
- Roti, Paratha, Naan, Rice varieties
- Dal Tadka, Dal Makhani, Sambhar
- Paneer dishes, Curries, Vegetables
- Samosa, Pakora, Dhokla, Dosa, Idli
- Sweets and beverages

### 5. Start the Server

```bash
uvicorn app.main:app --reload
```

Server runs at: `http://localhost:8000`

### 6. Test the API

Open your browser:
- **Swagger Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 🔌 Connecting Your Frontend

Your friend's frontend needs to:

1. **Set API Base URL:** `http://localhost:8000`

2. **Store JWT Token** after login/signup:
```javascript
const response = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.access_token);
```

3. **Use Token in Requests:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/foods', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📊 Database Schema

### Users
- Email, password, daily calorie goal

### Foods  
- 52 Indian foods with calories, protein, carbs, fats
- Indian portion sizes (katori, piece, etc.)

### Meals
- Links users to foods with meal type and quantity
- Automatic timestamp

## 🐛 Common Issues

### "Could not connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env` file
- Ensure database `calorie_tracker` exists

### "No module named 'app'"
- Activate virtual environment: `venv\Scripts\activate`
- Install requirements: `pip install -r requirements.txt`

### CORS errors from frontend
- Add frontend URL to CORS_ORIGINS in `.env`
- Default supports localhost:3000 and localhost:5173

## 📁 Project Structure

```
Project/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── config.py         # Settings
│   │   ├── database.py       # DB connection
│   │   ├── models/           # User, Food, Meal models
│   │   ├── schemas/          # Request/Response schemas
│   │   ├── routes/           # API endpoints
│   │   └── utils/            # Auth helpers
│   ├── scripts/
│   │   └── populate_foods.py # Indian foods data
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## 🎯 Quick Test

Once server is running:

```bash
# Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"

# This returns a token - use it for other endpoints!
```

## 📚 Full Documentation

See `README.md` for:
- Detailed PostgreSQL installation
- Complete API reference with examples
- Troubleshooting guide
- Testing instructions

---

**You're all set! 🚀 Start the server and connect your frontend!**
