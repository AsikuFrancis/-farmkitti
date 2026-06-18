from typing import Dict, Any
from app.models.disease import SeverityLevel

# Mock knowledge base for crop diseases
RECOMMENDATION_DB = {
    "Maize_Fall_Armyworm": {
        "severity": SeverityLevel.high,
        "recommendation": "Apply recommended pesticide (e.g., Emamectin benzoate) during early morning or late evening when caterpillars are active. Target the whorl of the plant.",
        "preventive_measures": "Practice crop rotation. Plant early. Use push-pull technology with Desmodium and Napier grass."
    },
    "Maize_Leaf_Blight": {
        "severity": SeverityLevel.medium,
        "recommendation": "Apply protective fungicides containing Mancozeb or Chlorothalonil if the disease appears before silking.",
        "preventive_measures": "Use resistant maize varieties. Ensure proper crop residue management by plowing under infected debris."
    },
    "Maize_Healthy": {
        "severity": SeverityLevel.low,
        "recommendation": "Continue current good agricultural practices.",
        "preventive_measures": "Maintain regular scouting for pests and diseases."
    },
    "Beans_Rust": {
        "severity": SeverityLevel.medium,
        "recommendation": "Apply systemic fungicides at the first sign of rust pustules.",
        "preventive_measures": "Plant certified disease-free seeds. Avoid working in the field when plants are wet to prevent spreading spores."
    },
    "Cassava_Mosaic_Disease": {
        "severity": SeverityLevel.critical,
        "recommendation": "Uproot and destroy infected plants immediately to prevent the spread by whiteflies.",
        "preventive_measures": "Use certified CMD-resistant cassava cuttings. Control whitefly populations."
    },
    "Tomato_Early_Blight": {
        "severity": SeverityLevel.medium,
        "recommendation": "Apply copper-based fungicides or appropriate systemic fungicides.",
        "preventive_measures": "Stake tomatoes to keep foliage off the ground. Practice 3-year crop rotation."
    }
}

def get_recommendation(disease_name: str) -> Dict[str, Any]:
    """
    Returns the severity, treatment recommendation, and preventive measures for a given disease.
    """
    return RECOMMENDATION_DB.get(disease_name, {
        "severity": SeverityLevel.medium,
        "recommendation": "Consult with your local agricultural extension officer.",
        "preventive_measures": "Maintain farm hygiene."
    })
