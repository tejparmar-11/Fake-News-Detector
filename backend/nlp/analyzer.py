import os
import re
import json
import httpx
from typing import Optional
from sklearn.metrics.pairwise import cosine_similarity
from nlp.web_scraper import scrape_google_search
from nlp.llm_inference import evaluate_claim_with_ollama

# Load Config
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "..", "config", "system_config.json")
try:
    with open(CONFIG_PATH, "r") as f:
        SYSTEM_CONFIG = json.load(f)
except Exception:
    SYSTEM_CONFIG = {"sources": {"trusted": [], "blacklisted": []}, "lexicons": {"fake_triggers": [], "credible_phrases": []}, "weights": {}}

FACT_CHECK_API_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
GOOGLE_FACT_CHECK_API_KEY = os.getenv("GOOGLE_FACT_CHECK_API_KEY", "")

FAKE_TRIGGER_WORDS = SYSTEM_CONFIG["lexicons"]["fake_triggers"]
CREDIBLE_PHRASES = SYSTEM_CONFIG["lexicons"]["credible_phrases"]
TRUSTED_DOMAINS = SYSTEM_CONFIG["sources"]["trusted"]
BLACKLISTED_DOMAINS = SYSTEM_CONFIG["sources"]["blacklisted"]
WEIGHTS = SYSTEM_CONFIG["weights"]

CLICKBAIT_PATTERNS = [
    r"\b(you won'?t believe)\b",
    r"\b(this will shock you)\b",
    r"\b(what they'?re not telling)\b",
    r"!{2,}",
    r"\?{2,}",
    r"\b[A-Z]{4,}\b",
    r"\b(number \d+ will)\b",
    r"\b(miracle|cures? (cancer|diabetes|covid))\b",
    r"\b(secret(ly)?|hidden truth)\b",
]

# ─── Helpers
def _count_uppercase_ratio(text: str) -> float:
    alpha = [c for c in text if c.isalpha()]
    return sum(1 for c in alpha if c.isupper()) / len(alpha) if alpha else 0.0

def _find_flagged_phrases(text: str):
    flagged = []
    lower = text.lower()
    for word in FAKE_TRIGGER_WORDS:
        if word.lower() in lower:
            flagged.append({"phrase": word, "type": "trigger", "severity": "high"})
    for phrase in CREDIBLE_PHRASES:
        if phrase.lower() in lower:
            flagged.append({"phrase": phrase, "type": "credible", "severity": "low"})
    return flagged

def _extract_domain(url: str) -> Optional[str]:
    if not url: return None
    match = re.search(r"(?:https?://)?(?:www\.)?([^/\s]+)", url)
    return match.group(1).lower() if match else None

# ─── Classical Scorers
def linguistic_score(text: str) -> float:
    score = 0.5
    lower = text.lower()
    fake_hits = sum(1 for w in FAKE_TRIGGER_WORDS if w.lower() in lower)
    credible_hits = sum(1 for p in CREDIBLE_PHRASES if p.lower() in lower)
    score -= min(fake_hits * 0.05, 0.4)
    score += min(credible_hits * 0.04, 0.3)
    caps_ratio = _count_uppercase_ratio(text)
    score -= caps_ratio * 0.3
    words = text.split()
    avg_word_len = sum(len(w) for w in words) / max(len(words), 1)
    if avg_word_len > 5.5: score += 0.05
    score += min(len(words) / 500, 0.1)
    return max(0.0, min(1.0, score))

def clickbait_score(text: str) -> float:
    score = 0.0
    for pattern in CLICKBAIT_PATTERNS:
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        score += matches * 0.12
    score += _count_uppercase_ratio(text) * 0.4
    exclamations = text.count("!")
    score += min(exclamations * 0.05, 0.3)
    return max(0.0, min(1.0, score))

def source_credibility_score(url: Optional[str]) -> float:
    if not url: return 0.5
    domain = _extract_domain(url)
    if not domain: return 0.5
    for trusted in TRUSTED_DOMAINS:
        if trusted in domain: return 0.95
    for blocked in BLACKLISTED_DOMAINS:
        if blocked in domain: return 0.05
    return 0.5

def bias_analysis(text: str) -> dict:
    left_keywords = ["progressive", "climate change", "social justice", "inequality", "diversity"]
    right_keywords = ["patriot", "freedom", "second amendment", "border security", "illegal immigration"]
    lower = text.lower()
    left_score = sum(1 for k in left_keywords if k in lower)
    right_score = sum(1 for k in right_keywords if k in lower)
    
    if left_score > right_score: return {"label": "Left-leaning", "score": min(0.5 + left_score * 0.08, 0.95)}
    elif right_score > left_score: return {"label": "Right-leaning", "score": min(0.5 + right_score * 0.08, 0.95)}
    return {"label": "Neutral", "score": 0.5}

# ─── Transformer Processing (Chunked)
def get_transformer_prediction(pipeline_model, text: str, max_chunk=512) -> float:
    """Returns probability of being FAKE."""
    words = text.split()
    chunks = [" ".join(words[i:i + max_chunk]) for i in range(0, len(words), max_chunk)]
    if not chunks: return 0.5
    
    probs = []
    for chunk in chunks:
        res = pipeline_model(chunk[:2000])[0] # Model max chars limit safety
        # Identify label based on roberta or distilbert
        # distilbert-base-uncased fine-tuned output might be LABEL_1 for fake. 
        # roberta-base-openai-detector outputs 'Fake' or 'Real'
        label = res['label'].lower()
        score = res['score']
        
        is_fake = "fake" in label or label == "label_1" or "false" in label
        fake_prob = score if is_fake else (1.0 - score)
        probs.append(fake_prob)
        
    return sum(probs) / len(probs)

# ─── Fact Checking
async def check_fact_api(text: str) -> dict:
    """Call Google Fact Check or Fallback."""
    if GOOGLE_FACT_CHECK_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(FACT_CHECK_API_URL, params={"query": text[:500], "key": GOOGLE_FACT_CHECK_API_KEY})
                data = resp.json()
                if "claims" in data and len(data["claims"]) > 0:
                    claim = data["claims"][0]
                    rating = claim.get("claimReview", [{}])[0].get("textualRating", "Unknown")
                    if any(bad in rating.lower() for bad in ["false", "ants on fire", "fake", "incorrect"]):
                        return {"matched": True, "fake_prob": 0.99, "source": claim.get("claimReview", [{}])[0].get("publisher", {}).get("name", "API")}
        except Exception:
            pass
            
    # Fallback Local JSON
    try:
        with open("nlp/mock_debunked_claims.json", "r") as f:
            local_claims = json.load(f)
        for claim in local_claims:
            # simple overlap
            if len(set(claim["text"].lower().split()) & set(text.lower().split())) > 4:
                return {"matched": True, "fake_prob": 0.95, "source": claim["publisher"]}
    except Exception:
        pass
        
    return {"matched": False, "fake_prob": 0.0, "source": None}

def db_tfidf_score(text: str, tfidf, tfidf_matrix, db_scores) -> float:
    """Compare input vs verified database text via Cosine Similarity."""
    vec = tfidf.transform([text])
    sims = cosine_similarity(vec, tfidf_matrix)
    best_idx = sims.argmax()
    best_score = sims[0, best_idx]
    
    # If the text matches a verified article closely
    if best_score > 0.4:
        reliability = db_scores[best_idx]
        return 1.0 - reliability # High credibility = low fake score
    return 0.5 # Neutral if no strong match

# ─── MAIN ENSEMBLE
async def analyze_text(text: str, source_url: Optional[str], ml_models: dict) -> dict:
    """Full ensemble with exact weights requested."""

    # 0. Check Manual Overrides first (Principle: Demo Control)
    manual_overrides = SYSTEM_CONFIG.get("manual_overrides", {})
    for trigger_key, data in manual_overrides.items():
        if trigger_key in text:
            # Probability to 0-100 scale for UI
            val = data["fake_prob"] * 100
            return {
                "verdict": "REAL" if data["fake_prob"] < 0.5 else "FAKE",
                "confidence": round((100 - val if val < 50 else val), 2),
                "fake_probability": val,
                "real_probability": 100 - val,
                "explanation": f"🎯 [MANUAL OVERRIDE] {data['explanation']}",
                "scores": {
                    "overall": round(val, 2),
                    "roberta": round(val, 2),
                    "distilbert": round(val, 2),
                    "linguistic": round(val, 2),
                    "clickbait": round(val, 2),
                    "source_credibility": 90 if val < 50 else 10,
                    "database_match": 50
                },
                "bias_label": "Neutral",
                "bias_score": 0.1,
                "flagged_phrases": [],
                "text_snippet": text[:200] + "..."
            }

    
    # 1. Linguistic & Heuristics
    ling_credibility = linguistic_score(text)
    ling_fake = 1.0 - ling_credibility
    
    clickbait_fake = clickbait_score(text)
    
    src_credibility = source_credibility_score(source_url)
    src_fake = 1.0 - src_credibility
    
    bias_res = bias_analysis(text)
    flagged = _find_flagged_phrases(text)
    
    db_fake = 0.5
    roberta_fake = 0.5
    distil_fake = 0.5
    
    if ml_models:
        # TF-IDF
        if "tfidf" in ml_models and ml_models["tfidf"]:
            db_fake = db_tfidf_score(text, ml_models["tfidf"], ml_models["tfidf_matrix"], ml_models["db_scores"])
            
        # Transformers
        if "roberta" in ml_models and ml_models["roberta"]:
            roberta_fake = get_transformer_prediction(ml_models["roberta"], text)
            
        if "distilbert" in ml_models and ml_models["distilbert"]:
            distil_fake = get_transformer_prediction(ml_models["distilbert"], text)
            
        # NER Adjustments
        if "spacy" in ml_models and ml_models["spacy"]:
            doc = ml_models["spacy"](text)
            entities = [ent.text for ent in doc.ents if ent.label_ in ['PERSON', 'ORG', 'GPE']]
            if not entities and len(text) > 200:
                ling_fake += 0.1 # Real news usually names people/places

    # Google Fact Check Override
    fact_check = await check_fact_api(text)
    
    # ─── REAL-TIME WEB SEARCH & LLM FACT CHECK (NEW) ───
    search_results = scrape_google_search(text[:200])
    llm_verdict = evaluate_claim_with_ollama(text, search_results)
    
    llm_fake = 1.0 if llm_verdict["verdict"] == "FALSE" else 0.5 if llm_verdict["verdict"] == "PARTIALLY TRUE" else 0.0
    
    # Use weights from system_config.json
    fake_probability = (
        (llm_fake * WEIGHTS.get("llm_web", 0.50)) +
        (roberta_fake * WEIGHTS.get("roberta", 0.20)) +
        (distil_fake * WEIGHTS.get("distilbert", 0.15)) +
        (ling_fake * WEIGHTS.get("linguistic", 0.10)) +
        (src_fake * WEIGHTS.get("source_credibility", 0.05))
    )
    
    # Enhanced Multi-Sentence Explanation for Transparency
    explanation = llm_verdict.get("explanation", "Ensemble prediction based on Transformer pipeline.")
    
    if src_fake < 0.2:
        explanation += f" Source ({source_url or 'N/A'}) is recognized as a highly trusted journalistic outlet."
    elif src_fake > 0.8:
        explanation += " Source is flagged as a known distributor of unverified or biased content."
        
    if clickbait_fake > 0.7:
        explanation += " The text uses sensationalist headline tactics common in clickbait."

    # Adjust for overly short context
    if len(text.split()) < 10 and not search_results:
        explanation = "⚠️ Extremely short text provided and no web context found. Accuracy is limited by lack of evidence."
        fake_probability = 0.5 + (fake_probability - 0.5) * 0.5
    
    # Adjust for Fact Check API Match (Heavy hammer)
    if fact_check["matched"]:
        fake_probability = max(fake_probability, fact_check["fake_prob"])
        explanation = f"Flagged by Fact-Check API matching debunked claim from {fact_check['source']}."
        db_fake = fact_check["fake_prob"]
    
    real_probability = 1.0 - fake_probability
    verdict = "FAKE" if fake_probability >= 0.5 else "REAL"
    confidence = (fake_probability if verdict == "FAKE" else real_probability) * 100

    return {
        "verdict": verdict,
        "confidence": round(confidence, 1),
        "explanation": explanation,
        "fake_probability": round(fake_probability * 100, 1),
        "real_probability": round(real_probability * 100, 1),
        "scores": {
            "roberta": round(roberta_fake * 100, 1),
            "distilbert": round(distil_fake * 100, 1),
            "linguistic": round(ling_credibility * 100, 1), # Return as credibility score for UI
            "clickbait": round(clickbait_fake * 100, 1),
            "source_credibility": round(src_credibility * 100, 1),
            "database_match": round(db_fake * 100, 1),
            "bias": round(bias_res["score"] * 100, 1),
        },
        "bias_label": bias_res["label"],
        "flagged_phrases": flagged,
        "text_snippet": text[:250] + "..." if len(text) > 250 else text,
    }

