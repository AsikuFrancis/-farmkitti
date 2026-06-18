import random
from typing import Dict, Any, Tuple
import io
from PIL import Image

class MockDiseaseModel:
    def __init__(self, model_path: str = None):
        self.model_path = model_path
        self.version = "v1.0.0-mock"
        # Simulated list of diseases
        self.classes = [
            "Maize_Fall_Armyworm",
            "Maize_Leaf_Blight",
            "Maize_Healthy",
            "Beans_Rust",
            "Cassava_Mosaic_Disease",
            "Tomato_Early_Blight"
        ]

    def predict(self, image_bytes: bytes) -> Tuple[str, float]:
        """
        Mock prediction. In production, this would load a TFLite model,
        preprocess the image, and run inference.
        """
        try:
            # Validate it's an image
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
        except Exception as e:
            raise ValueError(f"Invalid image format: {str(e)}")

        # Return a random mock prediction for MVP
        prediction = random.choice(self.classes)
        confidence = round(random.uniform(0.70, 0.99), 2)
        
        return prediction, confidence

# Singleton instance
disease_model = MockDiseaseModel()
