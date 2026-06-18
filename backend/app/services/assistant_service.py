from typing import Dict, Any

# Mock Knowledge Base for the Assistant
KNOWLEDGE_BASE = {
    "en": {
        "plant_maize": "The best time to plant maize in South Sudan is at the onset of the main rainy season, usually between mid-March and April. Ensure the soil is well-prepared and you use certified seeds.",
        "fall_armyworm": "To control Fall Armyworm, scout your fields regularly. Apply appropriate pesticides like Emamectin benzoate early in the morning or late evening. You can also use the push-pull technique with Desmodium.",
        "fertilizer_beans": "For beans, apply a basal fertilizer like DAP at planting. Avoid applying too much nitrogen as beans can fix their own nitrogen from the air.",
        "default": "I'm your Farmkiti Assistant. I can help with planting schedules, disease control, and crop management. Could you please rephrase your question?"
    },
    "sw": {
        "plant_maize": "Wakati mzuri wa kupanda mahindi ni mwanzoni mwa msimu wa mvua, kwa kawaida kati ya katikati ya Machi na Aprili. Hakikisha udongo umetayarishwa vizuri.",
        "default": "Mimi ni Msaidizi wako wa Farmkiti. Ninaweza kusaidia na ratiba za upanzi, udhibiti wa magonjwa, na usimamizi wa mazao."
    },
    "apd": {
        "plant_maize": "Wakit kwais ta zuraa sham fi Junub Sudan de badai ta karaf, min shahar talata li arba. Kutu batari samah.",
        "default": "Ana saadi ta Farmkiti. Ana bi saadi ita fi shugul ta zuraa. Ita da asaal shunu teli?"
    }
}

async def generate_assistant_response(message: str, language: str = "en") -> str:
    """
    Mock AI Assistant response generator.
    In production, this would call an LLM API (like Gemini/Claude/OpenAI) 
    with a carefully crafted system prompt containing agricultural context.
    """
    msg_lower = message.lower()
    lang_kb = KNOWLEDGE_BASE.get(language, KNOWLEDGE_BASE["en"])
    
    # Simple keyword matching for MVP
    if "maize" in msg_lower and "plant" in msg_lower:
        return lang_kb.get("plant_maize", lang_kb["default"])
    elif "armyworm" in msg_lower or "fall armyworm" in msg_lower:
        return lang_kb.get("fall_armyworm", lang_kb["default"])
    elif "fertilizer" in msg_lower and "beans" in msg_lower:
        return lang_kb.get("fertilizer_beans", lang_kb["default"])
        
    return lang_kb["default"]
