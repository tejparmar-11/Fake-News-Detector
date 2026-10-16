# TruthLens — Misinformation Detection Platform

TruthLens is a production-grade fake news detection platform built to combat misinformation with state-of-the-art NLP, real-time datasets, and an ultra-modern intuitive interface.

## 🚀 Features
- **NLP Ensemble Engine:** Combines heuristic linguistic rules with HuggingFace Transformer deep-learning sentiment models to hit high-accuracy classification.
- **Image Context Verification:** Reverse image check matching to surface maliciously manipulated/recycled images alongside text.
- **Dynamic Database Cross-Reference:** Scans claims against thousands of verified & debunked news records.
- **Narrative Bias Detection:** Identifies left/right framing using keyword association.
- **Stunning Modern UI:** Premium glassmorphism design, real-time global fake news ticker, intersection-driven animations.
- **Live Trending Heatmaps:** Pinpoint global misinformation hotspots.

## Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite (for seamless local development)
- **Frontend:** React 18, Vite, Tailwind v4, Framer Motion, Recharts

## 📦 Quick Start (Local No-Docker Setup)

You will need to open **two terminal windows**: one for the FastAPI backend, and one for the React frontend.

### 1. Start the Backend

Open your first terminal window, navigate to the `backend` folder, and run:

```bash
cd backend
python -m venv venv
# On Windows activate with: venv\Scripts\activate
# On Mac/Linux activate with: source venv/bin/activate

pip install -r requirements.txt
python -m db.init_db
uvicorn main:app --reload --port 8000
```
*Note: `python -m db.init_db` automatically creates the backend SQLite database file `truthlens.db` and populates it with realistic demo data so your dashboard is instantly ready to present.*

### 2. Start the Frontend

Open a **second terminal window**, navigate to the `frontend` folder, and run:

```bash
cd frontend
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) (or whatever port Vite selects, typically `5173` or `3000`) in your browser to start analyzing!

### Environment Configuration (Optional)
To enable real Hugging Face cloud deep-learning inference, rename `.env.example` to `.env` in the root folder and add a free Hugging Face token:
```env
HUGGINGFACE_API_TOKEN=your_token_here
```
If you don't add this token, the platform will gracefully fall back to local rule-based heuristics automatically!
