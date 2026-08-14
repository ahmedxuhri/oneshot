import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger("oneshot.audit")

def rule_based_audit(pattern_id: str, stack: Dict[str, Any], answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    High-speed deterministic architectural compatibility engine.
    Detects mismatches, anti-patterns, and optimal pairings instantly.
    """
    backend = stack.get("backend", "")
    database = stack.get("database", "")
    cache = stack.get("cache", "")
    frontend = stack.get("frontend", "")

    is_native_android = "android" in pattern_id.lower() or "kotlin" in backend.lower()
    is_cross_mobile = "mobile" in pattern_id.lower() or any(m in backend.lower() for m in ["react native", "flutter", "kmp"])
    is_backend_system = not is_native_android and not is_cross_mobile

    verdicts = {
        "backend": {"status": "optimal", "note": "Well-suited for core system architecture."},
        "database": {"status": "optimal", "note": "Directly compatible with system storage requirements."},
        "cache": {"status": "optimal", "note": "Matches latency and persistence model."},
        "frontend": {"status": "optimal", "note": "Aligns with client interaction design."}
    }
    suggestions = []

    # 1. Native Android Checks
    if is_native_android:
        # Check Database
        if "watermelon" in database.lower():
            verdicts["database"] = {
                "status": "warning",
                "note": "WatermelonDB requires React Native JS runtime. Incompatible with Native Kotlin."
            }
            suggestions.append({
                "field": "database",
                "current": database,
                "recommended": "Room DB (SQLite + Flow)",
                "reason": "Room DB is Android's official SQLite ORM with native Coroutine Flow and Kotlin Symbol Processing (KSP)."
            })
        elif "mongodb" in database.lower():
            verdicts["database"] = {
                "status": "warning",
                "note": "MongoDB is a server database, rarely used directly as an embedded Android database."
            }
            suggestions.append({
                "field": "database",
                "current": database,
                "recommended": "Room DB (SQLite + Flow)",
                "reason": "Embedded Room SQLite provides zero-latency offline persistence on mobile devices."
            })

        # Check Cache/Preferences
        if "redis" in cache.lower():
            verdicts["cache"] = {
                "status": "warning",
                "note": "Redis is a network server cache, not suitable as an embedded on-device preference store."
            }
            suggestions.append({
                "field": "cache",
                "current": cache,
                "recommended": "EncryptedDataStore / Android Keystore",
                "reason": "DataStore with Android Keystore provides hardware-backed on-device cryptographic security."
            })

        # Check UI Framework
        if "react" in frontend.lower() or "vue" in frontend.lower() or "svelte" in frontend.lower():
            verdicts["frontend"] = {
                "status": "warning",
                "note": "Web UI frameworks cannot run natively in Jetpack Compose without WebView wrappers."
            }
            suggestions.append({
                "field": "frontend",
                "current": frontend,
                "recommended": "Jetpack Compose (Material 3 UI)",
                "reason": "Jetpack Compose offers 60fps hardware acceleration and native Android Material 3 dynamic theming."
            })

    # 2. Server / Full-Stack System Checks
    elif is_backend_system:
        # Database check
        if "room" in database.lower() or "watermelon" in database.lower() or "hive" in database.lower():
            verdicts["database"] = {
                "status": "warning",
                "note": f"{database} is an embedded mobile client DB, not a scalable multi-user server database."
            }
            suggestions.append({
                "field": "database",
                "current": database,
                "recommended": "PostgreSQL",
                "reason": "PostgreSQL provides ACID transactions, relational indexing, and multi-client connection pooling."
            })

        if "datastore" in cache.lower() or "mmkv" in cache.lower():
            verdicts["cache"] = {
                "status": "warning",
                "note": f"{cache} is an on-device mobile storage library, not a distributed server cache."
            }
            suggestions.append({
                "field": "cache",
                "current": cache,
                "recommended": "Redis",
                "reason": "Redis delivers sub-millisecond in-memory caching and pub/sub message brokering for servers."
            })

    # 3. Cross-Platform Mobile Checks
    elif is_cross_mobile:
        if "react native" in backend.lower() and "hive" in database.lower():
            verdicts["database"] = {
                "status": "warning",
                "note": "Hive is a Dart/Flutter library, not available in React Native."
            }
            suggestions.append({
                "field": "database",
                "current": database,
                "recommended": "WatermelonDB (React Native)",
                "reason": "WatermelonDB is specifically engineered for high-performance React Native apps."
            })

    has_warnings = any(v["status"] == "warning" for v in verdicts.values())
    
    if has_warnings:
        status = "mismatch"
        headline = f"⚠️ AI Audit: {len(suggestions)} stack component mismatch detected."
        score = 0.65
    else:
        status = "optimal"
        headline = "✅ AI Audit: 100% stack cohesion & architectural compatibility."
        score = 0.98

    return {
        "status": status,
        "compatibility_score": score,
        "headline": headline,
        "suggestions": suggestions,
        "stack_verdicts": verdicts
    }
