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

    ai_prompt = f"""You are OneShot Interpreter AI. Your job is to match a user's rough system idea to the single best proven software architecture pattern.

User wants to build:
"{prompt}"

Available verified patterns:
{json.dumps(pattern_index, indent=2)}

Respond with ONLY a valid JSON object matching this schema:
{{
  "pattern_id": "<exact pattern id from available patterns>",
  "confidence": <float between 0.70 and 0.99>,
  "reasoning": "<1 concise sentence on why this pattern matches>",
  "search_queries": ["<query for best practices>", "<query for failure modes>"]
}}
"""

    parsed = None
    try:
        raw_response = bedrock.ask(ai_prompt, system="You are a senior system architect and precision pattern classifier. Always output raw JSON only.")
        # Parse JSON
        match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
    except Exception as e:
        logger.info(f"Bedrock invocation fallback: {e}")
        parsed = None

    if not parsed or "pattern_id" not in parsed:
        parsed = bedrock.classify_intent_fallback(prompt, patterns)

    # Find the matched pattern object
    matched_id = parsed.get("pattern_id")
    matched = next((p for p in patterns if p["id"] == matched_id), None)
    if not matched:
        # Fuzzy fallback to first pattern or default
        matched = patterns[0]

    # Perform background web searches for context and real-world tips
    search_queries = parsed.get("search_queries", [f"{matched['name']} architecture best practices", f"{matched['name']} common mistakes"])
    search_results = web_search(search_queries, max_per_query=2)

    confidence = parsed.get("confidence", matched.get("confidence_score", 0.92))

    return {
        "matched_pattern": matched["id"],
        "pattern_name": matched["name"],
        "pattern_category": matched.get("category", "system"),
        "pattern_description": matched.get("description", ""),
        "pattern_confidence": round(float(confidence), 2),
        "reasoning": parsed.get("reasoning", f"Matched '{matched['name']}' based on core architectural requirements."),
        "clarifying_questions": matched.get("clarifying_questions", []),
        "common_stacks": matched.get("common_stacks", ["Python + PostgreSQL", "Node.js + PostgreSQL", "Go + PostgreSQL"]),
        "data_models": list(matched.get("data_models", {}).keys()),
        "full_data_models": matched.get("data_models", {}),
        "known_constraints": matched.get("known_constraints", {}),
        "known_failure_modes": matched.get("known_failure_modes", []),
        "web_sources": search_results[:4],
        "all_available_patterns": [{"id": p["id"], "name": p["name"], "category": p.get("category")} for p in patterns]
    }

@router.get("/all")
async def list_patterns():
    patterns = load_all_patterns()
    return [{"id": p["id"], "name": p["name"], "category": p.get("category"), "description": p.get("description")} for p in patterns]
