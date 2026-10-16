import time
import logging
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

logger = logging.getLogger(__name__)

def scrape_google_search(query: str):
    """
    Uses headless Selenium to search Google for the claim and extracts 
    the top results (Title, Link, Snippet) using BeautifulSoup.
    """
    logger.info(f"Starting web search for claim: {query}")
    
    # Configure Headless Chrome
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    # Mask as a real browser to avoid instant bot detection
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")

    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Google Search URL
        search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
        driver.get(search_url)
        
        # Small sleep to let JS render if any (though Google usually sends HTML directly)
        time.sleep(2)
        
        soup = BeautifulSoup(driver.page_source, "html.parser")
        results = []
        
        # Google search result containers (usually div with class 'g' or similar)
        # Note: Google classes change often, so we look for standard result structures
        search_blocks = soup.select(".g")[:5] # Get top 5 results
        
        for block in search_blocks:
            title_tag = block.select_one("h3")
            link_tag = block.select_one("a")
            snippet_tag = block.select_one(".VwiC3b") # Common snippet class
            
            if title_tag and link_tag:
                results.append({
                    "title": title_tag.get_text(),
                    "link": link_tag.get("href"),
                    "snippet": snippet_tag.get_text() if snippet_tag else "No description available."
                })
        
        logger.info(f"Found {len(results)} search results.")
        return results

    except Exception as e:
        logger.error(f"Selenium Scraping Error: {e}")
        return []
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    # Quick standalone test
    print("Testing scraper...")
    test_query = "RCB won IPL 2025"
    data = scrape_google_search(test_query)
    for i, res in enumerate(data):
        print(f"\n[{i+1}] {res['title']}\n    {res['snippet']}")
