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
    from sqlalchemy import text
    import app.models  # Ensure all models are loaded
    async with engine.begin() as conn:
        print("Dropping existing tables to reset schema...")
        await conn.run_sync(Base.metadata.drop_all)
        # Drop orphan PostgreSQL ENUM types left behind by the old schema
        for enum_name in ("userrole", "gender", "cropstatus", "severitylevel"):
            try:
                await conn.execute(text(f"DROP TYPE IF EXISTS {enum_name} CASCADE"))
                print(f"Dropped enum type: {enum_name}")
            except Exception as e:
                print(f"Could not drop enum {enum_name} (may not exist or not PG): {e}")
        print("Creating database tables with clean schema...")
        await conn.run_sync(Base.metadata.create_all)
        print("Database schema ready.")

from app.api.v1.router import api_router

# We will include routers here later
app.include_router(api_router, prefix=settings.API_V1_STR)
