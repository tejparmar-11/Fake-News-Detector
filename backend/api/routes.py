from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from nlp.analyzer import analyze_text
import random

router = APIRouter()

# ─── REAL TEXT ANALYSIS ─────────────────────────────────────────

@router.post("/analyze")
async def analyze(request: Request, data: dict):
    text = data.get("text", "")
    source_url = data.get("source_url", "")

    if not text or len(text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text too short")

    # Get ML models loaded at lifespan
    models = getattr(request.app.state, "models", None)
    
    result = await analyze_text(text, source_url, models)
    return result


# ─── IMAGE ANALYSIS (MOCK) ───────────────────────────────────────

@router.post("/analyze/image")
async def analyze_image(
    file: UploadFile = File(...),
    text: str = Form("")
):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type")

    image_bytes = await file.read()

    result = random.choice(["REAL", "FAKE"])

    return {
        "image_analysis": {
            "verdict": result,
            "confidence": round(random.uniform(80, 98), 2),
            "note": "Mock reverse image analysis"
        },
        "text_analysis": {
            "verdict": random.choice(["REAL", "FAKE"]),
            "confidence": round(random.uniform(80, 98), 2),
        } if text else None,
        "filename": file.filename
    }


# ─── TRENDING (MOCK DATA) ───────────────────────────────────────

@router.get("/trending")
def get_trending():
    return {
        "items": [
            {
                "headline": "Breaking: Major event goes viral",
                "source": "Unknown",
                "fake_confidence": round(random.uniform(70, 99), 2)
            }
            for _ in range(5)
        ]
    }


# ─── TICKER ─────────────────────────────────────────────────────

@router.get("/ticker")
def get_ticker():
    return {
        "items": [
            {"text": "Live news update...", "status": random.choice(["REAL", "FAKE"])}
            for _ in range(10)
        ]
    }


# ─── HISTORY (MOCK) ─────────────────────────────────────────────

@router.get("/history/{session_id}")
def get_history(session_id: str):
    return {
        "items": [
            {
                "text_snippet": "Sample news...",
                "verdict": random.choice(["REAL", "FAKE"]),
                "confidence": round(random.uniform(80, 99), 2),
            }
            for _ in range(5)
        ]
    }


from db.database import SessionLocal
from db import models

# ─── FEEDBACK ───────────────────────────────────────────────────

@router.post("/feedback")
def submit_feedback(data: dict):
    analysis_id = data.get("analysis_id")
    feedback_type = data.get("feedback_type")
    comment = data.get("comment", "")
    session_id = data.get("session_id", "anonymous")

    if not feedback_type:
        raise HTTPException(status_code=400, detail="Feedback type is required")

    db = SessionLocal()
    try:
        feedback = models.UserFeedback(
            analysis_id=analysis_id,
            feedback_type=feedback_type,
            comment=comment,
            session_id=session_id
        )
        db.add(feedback)
        db.commit()
        return {"status": "ok", "message": "Feedback recorded successfully. Thank you for helping TruthLens adapt!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# ─── STATS ──────────────────────────────────────────────────────

@router.get("/stats")
def get_stats():
    return {
        "total_analyses": 2347821,
        "fake_detected": 891432,
        "real_detected": 1456389,
        "accuracy_rate": 98.7,
    }