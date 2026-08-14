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
        custom_requirements=req.custom_requirements or ""
    )

    return {
        "success": True,
        "pattern_id": pattern["id"],
        "pattern_name": pattern["name"],
        "spec": spec_result["spec"],
        "spec_instruction": spec_result["spec_instruction"],
        "filename": spec_result["filename"]
    }
