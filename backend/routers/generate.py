import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.pattern_loader import get_pattern
from services.spec_generator import build_spec_output

logger = logging.getLogger("oneshot.generate")
router = APIRouter()

class GenerateRequest(BaseModel):
    pattern_id: str
    answers: Dict[str, Any] = {}
    stack: Dict[str, Any] = {"backend": "Python (FastAPI)", "database": "PostgreSQL", "cache": "Redis", "frontend": "React"}
    custom_requirements: Optional[str] = ""
    domain_title: Optional[str] = None
    domain_summary: Optional[str] = None
    domain_models: Optional[Dict[str, Any]] = None
    user_prompt: Optional[str] = None
    design_theme: Optional[str] = "linear_dark"

@router.post("")
@router.post("/")
async def generate_spec(req: GenerateRequest):
    pattern = get_pattern(req.pattern_id)
    if not pattern:
        raise HTTPException(status_code=404, detail=f"Pattern '{req.pattern_id}' not found in library")

    spec_result = build_spec_output(
        pattern=pattern,
        answers=req.answers,
        stack=req.stack,
        custom_requirements=req.custom_requirements or "",
        domain_title=req.domain_title,
        domain_summary=req.domain_summary,
        domain_models=req.domain_models,
        user_prompt=req.user_prompt,
        design_theme=req.design_theme
    )

    return {
        "success": True,
        "pattern_id": pattern["id"],
        "pattern_name": pattern["name"],
        "spec": spec_result["spec"],
        "spec_instruction": spec_result["spec_instruction"],
        "design_md": spec_result["design_md"],
        "theme_info": spec_result.get("theme_info", {}),
        "filename": spec_result["filename"]
    }
