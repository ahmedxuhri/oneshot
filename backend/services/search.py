import logging
from typing import List, Dict, Any

logger = logging.getLogger("oneshot.search")

# Authoritative fallback architecture references
CURATED_FALLBACK_REFERENCES = [
    {
        "title": "Google Android Architecture Guide & Clean Compose Patterns",
        "body": "Official guide to app architecture: UI layer, domain use cases, data repositories, and Room SQLite offline caching.",
        "href": "https://developer.android.com/topic/architecture"
    },
    {
        "title": "Martin Fowler: Software Architecture & Microservice Patterns",
        "body": "Canonical patterns for distributed systems, event-driven architectures, domain-driven design (DDD), and CQRS.",
        "href": "https://martinfowler.com/architecture/"
    },
    {
        "title": "The Twelve-Factor App Methodology",
        "body": "Standard practices for building scalable, cloud-native SaaS applications with stateless processes and concurrency.",
        "href": "https://12factor.net/"
    },
    {
        "title": "AWS Architecture Center: Well-Architected Framework",
        "body": "Architectural pillars for reliability, security, cost optimization, and high availability systems.",
        "href": "https://aws.amazon.com/architecture/well-architected/"
    }
]

def web_search(queries: List[str], max_per_query: int = 2) -> List[Dict[str, Any]]:
    """
    Runs live web searches across queries to gather real-world architecture references & articles.
    """
    results = []
    if not queries:
        return CURATED_FALLBACK_REFERENCES[:3]

    try:
        # Prefer new ddgs package
        try:
            from ddgs import DDGS
        except ImportError:
            from duckduckgo_search import DDGS

        with DDGS() as ddgs:
            for query in queries[:2]:
                try:
                    clean_query = query.strip()
                    if not clean_query:
                        continue
                    search_res = list(ddgs.text(clean_query, max_results=max_per_query))
                    for r in search_res:
                        href = r.get("href", "")
                        title = r.get("title", "").strip()
                        body = r.get("body", "").strip()
                        if href and href.startswith("http") and not href.startswith("https://sudolaps.top"):
                            results.append({
                                "title": title or "Architecture Reference Guide",
                                "body": body or "Production implementation patterns and failure mode prevention.",
                                "href": href
                            })
                except Exception as query_err:
                    logger.warning(f"Error querying DDGS for '{query}': {query_err}")
    except Exception as e:
        logger.warning(f"DDGS web search initialization error: {e}")

    # If no live results found, return authentic external developer references
    if not results:
        results = CURATED_FALLBACK_REFERENCES[:3]

    return results
