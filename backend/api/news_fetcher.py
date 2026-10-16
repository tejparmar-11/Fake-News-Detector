import logging
from gnews import GNews
from nlp.analyzer import analyze_text
import asyncio

logger = logging.getLogger(__name__)

async def get_live_world_news_with_predictions(models):
    """
    Fetches live breaking news across the world and runs the
    transformer NLP pipeline on them instantly.
    """
    try:
        # Initialize Google News fetcher (English, Worldwide, max 10 results)
        google_news = GNews(language='en', country='US', max_results=10)
        articles = google_news.get_top_news()
        
        results = []
        for article in articles:
            # We will use the headline and very basic description as our ML payload
            text_payload = f"{article['title']}. {article.get('description', '')}"
            source_url = article['url']
            
            # Predict
            analysis = await analyze_text(text_payload, source_url, models)
            
            # Clean up the publisher name
            publisher = article.get('publisher', {}).get('title', 'Unknown Source')
            
            results.append({
                "headline": article['title'],
                "source": publisher,
                "url": source_url,
                "fake_confidence": analysis['fake_probability'],
                "published_date": article.get("published date", "Recently"),
                "verdict": analysis['verdict']
            })
            
            # Prevent rate limits / overheating pipeline
            await asyncio.sleep(0.1)

        # Sort by most trending (or arbitrarily we can sort by controversy: fake scores close to 50%)
        # Here we just leave it in the chronological breaking news order Google gives us.
        return results

    except Exception as e:
        logger.error(f"Failed to fetch live news: {e}")
        return []
