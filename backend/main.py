import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import interpret, generate
from services.pattern_loader import load_all_patterns, get_pattern

app = FastAPI(
    title="OneShot API",
    description="Zero-ambiguity precision specification engine for AI software construction",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sudolaps.top",
        "http://sudolaps.top",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interpret.router, prefix="/interpret", tags=["interpret"])
app.include_router(generate.router, prefix="/generate-spec", tags=["generate"])

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "oneshot",
        "version": "1.0.0",
        "patterns_loaded": len(load_all_patterns())
    }

@app.get("/patterns")
def list_all_patterns():
    return load_all_patterns()

@app.get("/patterns/{pattern_id}")
def get_single_pattern(pattern_id: str):
    p = get_pattern(pattern_id)
    if not p:
        return {"error": "Pattern not found"}
    return p

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3040))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
