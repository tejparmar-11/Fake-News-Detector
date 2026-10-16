"""Seed the database with realistic demo data."""
import random
from datetime import datetime, timedelta
from db import models


TRENDING_FAKE_NEWS = [
    {
        "headline": "Scientists discover COVID-19 vaccine causes 5G microchip activation in human blood",
        "source": "freedomtruth.net",
        "country": "United States",
        "category": "Health",
        "fake_confidence": 97.8,
        "debunked_by": "Snopes",
        "debunked_url": "https://www.snopes.com",
        "is_viral": True,
        "share_count": 284000,
    },
    {
        "headline": "BREAKING: Moon landing was staged in Nevada desert, NASA whistleblower confesses",
        "source": "conspiracywatch.info",
        "country": "United States",
        "category": "Technology",
        "fake_confidence": 99.1,
        "debunked_by": "FactCheck.org",
        "debunked_url": "https://www.factcheck.org",
        "is_viral": True,
        "share_count": 512000,
    },
    {
        "headline": "Eating raw garlic every morning CURES cancer, Harvard study reveals",
        "source": "healthmiracle.today",
        "country": "India",
        "category": "Health",
        "fake_confidence": 94.5,
        "debunked_by": "AFP Fact Check",
        "debunked_url": "https://factcheck.afp.com",
        "is_viral": False,
        "share_count": 87000,
    },
    {
        "headline": "Government secretly adding fluoride to water to control population minds",
        "source": "trutheagle.org",
        "country": "United Kingdom",
        "category": "Politics",
        "fake_confidence": 96.2,
        "debunked_by": "Full Fact",
        "debunked_url": "https://fullfact.org",
        "is_viral": False,
        "share_count": 63000,
    },
    {
        "headline": "World leaders gathered in secret bunker to plan global economic collapse in 2025",
        "source": "globalalert.net",
        "country": "Germany",
        "category": "Politics",
        "fake_confidence": 98.4,
        "debunked_by": "Reuters Fact Check",
        "debunked_url": "https://www.reuters.com/fact-check",
        "is_viral": True,
        "share_count": 341000,
    },
    {
        "headline": "Electric vehicles spontaneously explode when driven above 60mph, study finds",
        "source": "autoveritas.co",
        "country": "Australia",
        "category": "Technology",
        "fake_confidence": 91.7,
        "debunked_by": "PolitiFact",
        "debunked_url": "https://www.politifact.com",
        "is_viral": False,
        "share_count": 45000,
    },
    {
        "headline": "Drinking bleach solution kills coronavirus instantly, doctors recommend",
        "source": "medicaltruth247.com",
        "country": "Brazil",
        "category": "Health",
        "fake_confidence": 99.9,
        "debunked_by": "WHO",
        "debunked_url": "https://www.who.int",
        "is_viral": True,
        "share_count": 198000,
    },
    {
        "headline": "Celebrity couple secretly funds global child trafficking ring revealed in leaked docs",
        "source": "exposethemall.net",
        "country": "United States",
        "category": "Entertainment",
        "fake_confidence": 97.3,
        "debunked_by": "Snopes",
        "debunked_url": "https://www.snopes.com",
        "is_viral": True,
        "share_count": 720000,
    },
    {
        "headline": "5G towers emit radiation that shrinks brain cells, Chinese study claims",
        "source": "radiationwatch.today",
        "country": "France",
        "category": "Technology",
        "fake_confidence": 95.8,
        "debunked_by": "AFP Fact Check",
        "debunked_url": "https://factcheck.afp.com",
        "is_viral": False,
        "share_count": 112000,
    },
    {
        "headline": "Ancient Mayan calendar predicts asteroid collision with Earth on December 21, 2025",
        "source": "prophetictruth.org",
        "country": "Mexico",
        "category": "World",
        "fake_confidence": 92.1,
        "debunked_by": "NASA Jet Propulsion Lab",
        "debunked_url": "https://www.jpl.nasa.gov",
        "is_viral": False,
        "share_count": 78000,
    },
]

VERIFIED_NEWS = [
    ("US Federal Reserve raises interest rates by 0.25 percentage points", "Reuters", "United States", "Politics", 0.97),
    ("WHO reports 15% decline in global malaria deaths over past decade", "BBC News", "World", "Health", 0.96),
    ("Apple announces iPhone 17 with foldable display technology", "The Guardian", "United States", "Technology", 0.94),
    ("UEFA Champions League final set for Wembley Stadium in June", "AP News", "United Kingdom", "Sports", 0.98),
    ("India's GDP grows 7.2% in Q3, beats analyst expectations", "Financial Times", "India", "World", 0.95),
    ("SpaceX successfully launches 60 more Starlink satellites into orbit", "NPR", "United States", "Technology", 0.97),
    ("UN climate report warns of 2.5°C rise by 2100 without immediate action", "Reuters", "World", "World", 0.96),
    ("New Oxford study links ultra-processed food to increased dementia risk", "BBC News", "United Kingdom", "Health", 0.93),
]


def seed_all(db):
    base_date = datetime.utcnow()

    # Seed trending fake news
    for i, item in enumerate(TRENDING_FAKE_NEWS):
        days_ago = random.randint(0, 14)
        pub_date = base_date - timedelta(days=days_ago, hours=random.randint(0, 23))
        record = models.TrendingFakeNews(
            headline=item["headline"],
            source=item["source"],
            country=item["country"],
            category=item["category"],
            fake_confidence=item["fake_confidence"],
            debunked_by=item["debunked_by"],
            debunked_url=item["debunked_url"],
            published_at=pub_date,
            is_viral=item["is_viral"],
            share_count=item["share_count"],
        )
        db.add(record)

    # Seed verified news
    for headline, source, country, category, credibility in VERIFIED_NEWS:
        days_ago = random.randint(0, 7)
        pub_date = base_date - timedelta(days=days_ago, hours=random.randint(0, 23))
        record = models.VerifiedNewsArticle(
            headline=headline,
            source=source,
            country=country,
            category=category,
            credibility_score=credibility,
            published_at=pub_date,
        )
        db.add(record)

    # Seed platform stats
    stats = models.PlatformStats(
        total_analyses=2347821,
        fake_detected=891432,
        real_detected=1456389,
    )
    db.add(stats)

    db.commit()
