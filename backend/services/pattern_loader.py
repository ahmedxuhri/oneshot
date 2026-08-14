import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional

PATTERNS_DIR = Path(os.getenv("PATTERNS_DIR", "/root/mad/sessions/oneshot/backend/patterns"))

def load_all_patterns() -> List[Dict[str, Any]]:
    """
    Loads all pattern JSON files from the patterns directory.
    """
    patterns = []
    if not PATTERNS_DIR.exists():
        # Fallback to local ./patterns
        local_dir = Path(__file__).resolve().parent.parent / "patterns"
        search_dir = local_dir if local_dir.exists() else PATTERNS_DIR
    else:
        search_dir = PATTERNS_DIR

    for f in sorted(search_dir.glob("*.json")):
        try:
            with open(f, "r", encoding="utf-8") as fh:
                data = json.load(fh)
                patterns.append(data)
        except Exception as e:
            print(f"Error loading pattern file {f}: {e}")
            
    return patterns

def get_pattern(pattern_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves a single pattern by its ID or filename.
    """
    patterns = load_all_patterns()
    for p in patterns:
        if p.get("id") == pattern_id or pattern_id in (p.get("id", ""), p.get("name", "")):
            return p
    return None
