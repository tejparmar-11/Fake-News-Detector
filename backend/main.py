import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

from api.routes import router

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load state-of-the-art Deep Learning models on startup
    models = {}
    
    logger.info("Loading RoBERTa Fake News Deep Learning Model... (High-Accuracy Mode)")
    try:
        # Re-enabling the massive professional models as we have 7GB space now
        models["roberta"] = pipeline("text-classification", model="ghanashyamvtatti/roberta-fake-news")
        logger.info("RoBERTa Model Loaded Successfully.")
    except Exception as e:
        logger.error(f"Failed to load RoBERTa: {e}")
        models["roberta"] = None
        
    logger.info("Loading DistilBERT Fake News Deep Learning Model...")
    try:
        models["distilbert"] = pipeline("text-classification", model="mrm8488/distilbert-base-multi-cased-finetuned-fake-news")
        logger.info("DistilBERT Model Loaded Successfully.")
    except Exception as e:
        logger.error(f"Failed to load DistilBERT: {e}")
        models["distilbert"] = None
        
    app.state.models = models
    yield
    
    # Clean up ML models on shutdown
    app.state.models.clear()

app = FastAPI(lifespan=lifespan)

# ✅ ADD THIS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Backend running with Deep Learning models initialized"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)