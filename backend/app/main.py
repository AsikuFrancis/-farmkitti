from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Farmkiti API"}

@app.on_event("startup")
async def startup_event():
    from app.database import engine, Base
    import app.models  # Ensure all models are loaded
    async with engine.begin() as conn:
        print("Creating database tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
        print("Database schema ready.")

from app.api.v1.router import api_router

# We will include routers here later
app.include_router(api_router, prefix=settings.API_V1_STR)
