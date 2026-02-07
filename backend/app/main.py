from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routes import auth, users, foods, meals, seed

# ...

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(foods.router)
app.include_router(meals.router)
app.include_router(seed.router)


@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": "Calorie Tracker API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
