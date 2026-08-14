import json
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel

from services.bedrock import bedrock
from services.audit_service import rule_based_audit
from services.pattern_loader import get_pattern

logger = logging.getLogger("oneshot.audit_router")
router = APIRouter()

class AuditRequest(BaseModel):
    pattern_id: str
    stack: Dict[str, Any]
    answers: Dict[str, Any] = {}

@router.post("")
@router.post("/")
async def audit_stack(req: AuditRequest):
    pattern = get_pattern(req.pattern_id)
    pattern_name = pattern.get("name", req.pattern_id) if pattern else req.pattern_id
    
    # 1. Run immediate rule-based audit
    audit_res = rule_based_audit(req.pattern_id, req.stack, req.answers)
    
    # 2. If Bedrock is available, enhance with AI reasoning
    ai_prompt = f"""You are OneShot AI Architecture Auditor.
System Pattern: {pattern_name} ({req.pattern_id})
User Selections: {json.dumps(req.answers)}
Selected Stack:
- Backend: {req.stack.get('backend')}
- Database: {req.stack.get('database')}
- Cache/Storage: {req.stack.get('cache')}
- Frontend: {req.stack.get('frontend')}

Audit this combination for architectural mismatches (e.g. React Native DB with Kotlin Android, or mobile DB on backend).
Respond with ONLY JSON:
{{
  "status": "optimal" | "warning" | "mismatch",
  "headline": "<1 concise summary sentence>",
  "suggestions": [
    {{
      "field": "backend" | "database" | "cache" | "frontend",
      "recommended": "<replacement>",
      "reason": "<concise reason>"
    }}
  ]
}}
"""
    try:
        raw = bedrock.ask(ai_prompt, system="You are an expert system auditor. Return only valid JSON.")
        import re
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            bedrock_eval = json.loads(match.group())
            if bedrock_eval.get("status") in ["warning", "mismatch"] and bedrock_eval.get("suggestions"):
                audit_res["headline"] = f"⚡ Bedrock AI Audit: {bedrock_eval.get('headline', audit_res['headline'])}"
                if not audit_res["suggestions"]:
                    audit_res["suggestions"] = bedrock_eval.get("suggestions")
                    audit_res["status"] = bedrock_eval.get("status")
    except Exception as e:
        logger.info(f"Bedrock live audit fallback: {e}")

    return audit_res
