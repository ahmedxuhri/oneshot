import json
import re
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.bedrock import bedrock
from services.search import web_search
from services.pattern_loader import load_all_patterns, get_pattern

logger = logging.getLogger("oneshot.interpret")
router = APIRouter()

class InterpretRequest(BaseModel):
    prompt: str

@router.post("")
@router.post("/")
async def interpret(req: InterpretRequest):
    prompt = req.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    patterns = load_all_patterns()
    if not patterns:
        raise HTTPException(status_code=500, detail="Pattern database is empty")

    pattern_index = [
        {
            "id": p["id"],
            "name": p["name"],
            "category": p.get("category", ""),
            "description": p.get("description", ""),
            "keywords": p.get("keywords", [])
        }
        for p in patterns
    ]

    ai_prompt = f"""You are OneShot Precision Architecture AI.
User wants to build:
"{prompt}"

Available verified patterns:
{json.dumps(pattern_index, indent=2)}

Task:
1. Match to the single best architecture pattern_id. (If the user asks for a mobile/Android app for a specific domain like Chat or Booking, match the domain pattern or mobile pattern appropriately).
2. Detect the primary target platform: "android" | "ios" | "cross_platform_mobile" | "fullstack_web" | "backend_api".
3. Generate a concise domain title (e.g. "Gym Workout & Exercise Tracker" or "Android Appointment Booking App").
4. Generate a 1-2 sentence domain summary explaining what this specific app does.
5. Generate 2-3 domain-specific data models (tables + columns + types) specifically tailored to this user's application idea.

Respond with ONLY valid JSON:
{{
  "pattern_id": "<exact pattern id>",
  "target_platform": "android" | "ios" | "cross_platform_mobile" | "fullstack_web" | "backend_api",
  "confidence": 0.95,
  "domain_title": "<Concise domain title>",
  "domain_summary": "<1-2 sentence description of what this specific application builds>",
  "domain_models": {{
    "<table_name>": {{
      "table": "<table_name>",
      "fields": [
        {{ "name": "id", "type": "UUID / String (@PrimaryKey)", "primary": true }},
        {{ "name": "<field_name>", "type": "<type>", "nullable": false }}
      ],
      "indexes": ["<indexed_column>"]
    }}
  }},
  "reasoning": "<1 concise sentence on why this pattern matches>",
  "search_queries": ["<query1>", "<query2>"]
}}
"""

    parsed = None
    try:
        raw_response = bedrock.ask(ai_prompt, system="You are a senior software architect and precision system specifier. Always return valid JSON only.")
        match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
    except Exception as e:
        logger.info(f"Bedrock invocation fallback: {e}")
        parsed = None

    if not parsed or "pattern_id" not in parsed:
        parsed = bedrock.classify_intent_fallback(prompt, patterns)
        parsed["domain_title"] = prompt.title()[:50]
        parsed["domain_summary"] = prompt
        parsed["domain_models"] = {}

    # Detect platform with fallback heuristics
    prompt_lower = prompt.lower()
    target_platform = parsed.get("target_platform")
    if not target_platform or target_platform == "fullstack_web":
        if any(k in prompt_lower for k in ["android", "kotlin", "jetpack compose", "apk", "room db"]):
            target_platform = "android"
        elif any(k in prompt_lower for k in ["ios", "swift", "swiftui", "iphone", "ipad"]):
            target_platform = "ios"
        elif any(k in prompt_lower for k in ["flutter", "react native", "expo", "mobile app", "phone app"]):
            target_platform = "cross_platform_mobile"
        elif any(k in prompt_lower for k in ["cli", "terminal", "command line"]):
            target_platform = "cli"
        elif "android" in parsed.get("pattern_id", ""):
            target_platform = "android"
        elif "mobile" in parsed.get("pattern_id", ""):
            target_platform = "cross_platform_mobile"
        else:
            target_platform = "fullstack_web"

    matched_id = parsed.get("pattern_id")
    matched = next((p for p in patterns if p["id"] == matched_id), None)
    if not matched:
        matched = patterns[0]

    domain_title = parsed.get("domain_title") or matched["name"]
    domain_summary = parsed.get("domain_summary") or prompt
    domain_models = parsed.get("domain_models") or {}

    # Merge pattern infrastructure models with user's domain models
    merged_models = {**domain_models, **matched.get("data_models", {})}

    search_queries = parsed.get("search_queries", [f"{domain_title} architecture best practices", f"{matched['name']} common mistakes"])
    search_results = web_search(search_queries, max_per_query=2)

    confidence = parsed.get("confidence", matched.get("confidence_score", 0.92))

    return {
        "user_prompt": prompt,
        "target_platform": target_platform,
        "domain_title": domain_title,
        "domain_summary": domain_summary,
        "matched_pattern": matched["id"],
        "pattern_name": matched["name"],
        "pattern_category": matched.get("category", "system"),
        "pattern_description": matched.get("description", ""),
        "pattern_confidence": round(float(confidence), 2),
        "reasoning": parsed.get("reasoning", f"Matched '{matched['name']}' based on core architectural requirements."),
        "clarifying_questions": matched.get("clarifying_questions", []),
        "common_stacks": matched.get("common_stacks", ["Python + PostgreSQL", "Node.js + PostgreSQL", "Go + PostgreSQL"]),
        "data_models": list(merged_models.keys()),
        "full_data_models": merged_models,
        "domain_models": domain_models,
        "known_constraints": matched.get("known_constraints", {}),
        "known_failure_modes": matched.get("known_failure_modes", []),
        "web_sources": search_results[:4],
        "all_available_patterns": [{"id": p["id"], "name": p["name"], "category": p.get("category")} for p in patterns]
    }
