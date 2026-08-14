import boto3
import json
import os
import re
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger("oneshot.bedrock")

CANDIDATE_MODELS = [
    os.getenv("BEDROCK_MODEL_ID", "amazon.nova-pro-v1:0"),
    "amazon.nova-pro-v1:0",
    "amazon.nova-lite-v1:0",
    "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "anthropic.claude-3-haiku-20240307-v1:0"
]

class BedrockService:
    def __init__(self):
        self.region = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        self.client = None
        self._init_client()

    def _init_client(self):
        try:
            self.client = boto3.client(
                "bedrock-runtime",
                region_name=self.region,
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
            )
        except Exception as e:
            logger.warning(f"Could not initialize Bedrock client: {e}")

    def ask(self, prompt: str, system: Optional[str] = None) -> str:
        """
        Sends a prompt to AWS Bedrock Converse API trying active models.
        """
        if not self.client:
            self._init_client()
        if not self.client:
            raise RuntimeError("Bedrock client not initialized")

        messages = [{"role": "user", "content": [{"text": prompt}]}]
        kwargs_base = {"messages": messages}
        if system:
            kwargs_base["system"] = [{"text": system}]

        last_error = None
        for model in CANDIDATE_MODELS:
            try:
                kwargs = {**kwargs_base, "modelId": model}
                response = self.client.converse(**kwargs)
                return response["output"]["message"]["content"][0]["text"]
            except Exception as e:
                last_error = e
                logger.info(f"Model {model} failed: {e}")
                continue

        logger.error(f"All Bedrock candidate models failed. Last error: {last_error}")
        raise last_error

    def classify_intent_fallback(self, prompt: str, patterns: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Intelligent local semantic & keyword classifier used if Bedrock is offline or lacks credentials.
        """
        prompt_lower = prompt.lower().strip()
        words = set(re.findall(r'\b[a-z0-9_]+\b', prompt_lower))
        
        scores = []
        for p in patterns:
            score = 0.0
            pattern_id = p.get("id", "")
            pattern_name = p.get("name", "").lower()
            pattern_desc = p.get("description", "").lower()
            keywords = [k.lower() for k in p.get("keywords", [])]
            category = p.get("category", "").lower()

            for kw in keywords:
                if kw in prompt_lower:
                    score += 4.0
                elif any(w in kw for w in words):
                    score += 1.5

            if pattern_name in prompt_lower:
                score += 5.0
            for name_word in pattern_name.split():
                if name_word in words and len(name_word) > 2:
                    score += 1.2

            if category in words:
                score += 2.0

            desc_words = set(re.findall(r'\b[a-z0-9_]+\b', pattern_desc))
            overlap = len(words.intersection(desc_words))
            score += overlap * 0.4

            conf = min(0.98, max(0.70, 0.70 + (score / 10.0) * 0.28))
            scores.append((score, conf, p))

        scores.sort(key=lambda x: x[0], reverse=True)
        best_score, confidence, best_pattern = scores[0]

        query1 = f"{best_pattern['name']} best practices architecture database schema"
        query2 = f"{best_pattern['name']} common security pitfalls failure modes"
        
        return {
            "pattern_id": best_pattern["id"],
            "confidence": round(confidence, 2),
            "search_queries": [query1, query2]
        }

bedrock = BedrockService()
