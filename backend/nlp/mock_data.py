"""Mock data generators for live news ticker and misc demo data."""
import random
from datetime import datetime, timedelta

REAL_HEADLINES = [
    ("US Federal Reserve holds interest rates steady amid inflation data", "Reuters"),
    ("WHO declares end to mpox public health emergency", "BBC News"),
    ("NASA's Artemis mission successfully orbits the Moon", "AP News"),
    ("India surpasses China as world's most populous nation, UN data shows", "The Guardian"),
    ("OpenAI releases GPT-5 with real-time reasoning capabilities", "Financial Times"),
    ("European parliament approves landmark AI regulation act", "Reuters"),
    ("Global wheat prices fall 12% as Ukraine resumes exports", "Bloomberg"),
    ("Scientists develop biodegradable plastic from seaweed", "NPR"),
    ("Record 4.2 billion people vote in global elections this year", "CBS News"),
    ("Apple announces $1 trillion in buybacks plans for 2025", "CNBC"),
    ("UK economy grows 0.3% in Q4, beating recession fears", "BBC News"),
    ("SpaceX Starship completes first orbital flight successfully", "The Verge"),
    ("Amazon rainforest deforestation drops 50% under new policies", "Guardian"),
    ("Tokyo Olympics legacy fund builds 500 community sports centers", "AP News"),
    ("Global EV sales top 20 million units for first time in 2024", "Reuters"),
]

FAKE_HEADLINES = [
    ("SECRET: Bill Gates admits microchips in COVID vaccines during private meeting LEAKED", "truthbomb.net"),
    ("EXPOSED: The moon is a hologram projected by NASA satellites", "realawakening.co"),
    ("Doctors FORBIDDEN from telling you this one fruit cures diabetes OVERNIGHT", "healthfreedom.org"),
    ("URGENT: Government passes law to ban cash by March 2025 — act NOW", "libertybell.info"),
    ("Chemtrails confirmed: Pilots reveal they spray lithium to control masses", "skywatchers.net"),
    ("SHOCKING: Antarctica is actually a wall surrounding flat Earth, sailor reveals", "flattruth.org"),
    ("Eating tide pods strengthens immune system, suppressed Harvard research shows", "healthalt.net"),
    ("George Soros funds secret army of 500,000 to overthrow US elections in 2025", "patriotpulse.net"),
    ("BREAKING: Elon Musk secretly controls the global internet kill switch", "techconspiracy.info"),
    ("Scientists who discovered cure for cancer found dead hours before press conference", "silencedtruth.com"),
]


def generate_ticker_items(count: int = 20) -> list:
    """Generate a mix of real and fake news for the live ticker."""
    items = []
    base_time = datetime.utcnow()

    for i in range(count):
        is_real = random.random() > 0.35
        delta = timedelta(minutes=random.randint(5, 480))
        ts = (base_time - delta).strftime("%H:%M UTC")

        if is_real:
            headline, source = random.choice(REAL_HEADLINES)
            items.append({
                "headline": headline,
                "source": source,
                "verdict": "REAL",
                "confidence": round(random.uniform(88, 99), 1),
                "timestamp": ts,
            })
        else:
            headline, source = random.choice(FAKE_HEADLINES)
            items.append({
                "headline": headline,
                "source": source,
                "verdict": "FAKE",
                "confidence": round(random.uniform(87, 99), 1),
                "timestamp": ts,
            })

    return items


def generate_country_stats() -> list:
    """Country-wise misinformation spread data."""
    return [
        {"country": "United States", "fake_count": 45230, "code": "US"},
        {"country": "India", "fake_count": 38910, "code": "IN"},
        {"country": "Brazil", "fake_count": 29440, "code": "BR"},
        {"country": "Indonesia", "fake_count": 18750, "code": "ID"},
        {"country": "Mexico", "fake_count": 14230, "code": "MX"},
        {"country": "Philippines", "fake_count": 12870, "code": "PH"},
        {"country": "Nigeria", "fake_count": 11200, "code": "NG"},
        {"country": "Russia", "fake_count": 10450, "code": "RU"},
        {"country": "Pakistan", "fake_count": 9830, "code": "PK"},
        {"country": "Germany", "fake_count": 7640, "code": "DE"},
        {"country": "France", "fake_count": 6980, "code": "FR"},
        {"country": "United Kingdom", "fake_count": 6540, "code": "GB"},
        {"country": "Turkey", "fake_count": 5920, "code": "TR"},
        {"country": "Argentina", "fake_count": 4780, "code": "AR"},
        {"country": "South Africa", "fake_count": 3960, "code": "ZA"},
    ]
