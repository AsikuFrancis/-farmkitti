from fastapi import APIRouter
from app.api.v1 import auth, farmers, farms, disease, assistant, weather, community, messages, analytics, erp_sync

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(farmers.router, prefix="/farmers", tags=["farmers"])
api_router.include_router(farms.router, prefix="/farms", tags=["farms"])
api_router.include_router(disease.router, prefix="/disease", tags=["disease detection"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["ai assistant"])
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
api_router.include_router(community.router, prefix="/community", tags=["community"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(erp_sync.router, prefix="/erp-sync", tags=["erp sync"])
