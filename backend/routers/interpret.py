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
1. Match to the single best architecture pattern_id.
2. Generate a concise domain title (e.g. "Gym Workout & Exercise Tracker" or "Pet Boarding Marketplace").
3. Generate a 1-2 sentence domain summary explaining what this specific app does.
4. Generate 2-3 domain-specific data models (tables + columns + types) specifically tailored to this user's application idea (e.g. workouts, exercise_logs for fitness; listings, pets for pet boarding).

Respond with ONLY valid JSON:
{{
  "pattern_id": "<exact pattern id>",
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
