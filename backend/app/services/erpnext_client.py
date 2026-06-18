import httpx
import os
import json
from typing import Dict, Any

class ERPNextClient:
    def __init__(self):
        # Read from environment in production
        self.base_url = os.environ.get("ERPNEXT_URL", "https://erp.farmkitti.com")
        self.api_key = os.environ.get("ERPNEXT_API_KEY", "mock_key")
        self.api_secret = os.environ.get("ERPNEXT_API_SECRET", "mock_secret")
        
        self.headers = {
            "Authorization": f"token {self.api_key}:{self.api_secret}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    async def create_farmer(self, farmer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a new Farmer record in ERPNext's Agriculture module.
        Mapping Farmkitti backend fields to ERPNext fields.
        """
        erp_payload = {
            "farmer_name": farmer_data.get("full_name"),
            "phone_number": farmer_data.get("phone_number"),
            "location": farmer_data.get("location"),
            # Add custom fields as needed by the ERPNext installation
            "custom_farmkitti_id": str(farmer_data.get("id"))
        }

        # Mocking the request for MVP
        print(f"[ERPNext Mock] Creating Farmer in ERPNext: {json.dumps(erp_payload)}")
        return {"status": "success", "erp_id": "FARMER-0001"}
        
        # Real Implementation:
        # async with httpx.AsyncClient() as client:
        #     response = await client.post(
        #         f"{self.base_url}/api/resource/Farmer",
        #         json=erp_payload,
        #         headers=self.headers
        #     )
        #     response.raise_for_status()
        #     return response.json()

    async def create_farm(self, farm_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a Land Unit / Farm in ERPNext.
        """
        erp_payload = {
            "land_unit_name": farm_data.get("farm_name"),
            "area": farm_data.get("size"),
            "custom_latitude": farm_data.get("latitude"),
            "custom_longitude": farm_data.get("longitude"),
            "custom_farmkitti_id": str(farm_data.get("id"))
        }

        print(f"[ERPNext Mock] Creating Farm in ERPNext: {json.dumps(erp_payload)}")
        return {"status": "success", "erp_id": "FARM-0001"}

erp_client = ERPNextClient()
