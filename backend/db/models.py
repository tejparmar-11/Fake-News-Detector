from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from db.database import Base


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), index=True)
    text_snippet = Column(String(300))
    full_text = Column(Text)
    source_url = Column(String(500), nullable=True)
    category = Column(String(50), nullable=True)
    verdict = Column(String(10))  # "REAL" | "FAKE"
    confidence = Column(Float)
    linguistic_score = Column(Float)
    sentiment_score = Column(Float)
    clickbait_score = Column(Float)
    source_credibility_score = Column(Float)
    database_match_score = Column(Float)
    bias_score = Column(Float)
    bias_label = Column(String(20))
    flagged_phrases = Column(JSON, default=[])
    image_analysis = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TrendingFakeNews(Base):
    __tablename__ = "trending_fake_news"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String(500))
    source = Column(String(200))
    country = Column(String(100))
    category = Column(String(50))
    fake_confidence = Column(Float)
    debunked_by = Column(String(200))
    debunked_url = Column(String(500))
    published_at = Column(DateTime(timezone=True))
    is_viral = Column(Boolean, default=False)
    share_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class VerifiedNewsArticle(Base):
    __tablename__ = "verified_news"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String(500))
    source = Column(String(200))
    country = Column(String(100))
    category = Column(String(50))
    credibility_score = Column(Float)
    published_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserFeedback(Base):
    __tablename__ = "user_feedback"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, index=True)
    session_id = Column(String(64))
    feedback_type = Column(String(20))  # "correct" | "incorrect" | "unsure"
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PlatformStats(Base):
    __tablename__ = "platform_stats"

    id = Column(Integer, primary_key=True, index=True)
    total_analyses = Column(Integer, default=0)
    fake_detected = Column(Integer, default=0)
    real_detected = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
