import ollama
import logging

logger = logging.getLogger(__name__)

def evaluate_claim_with_ollama(claim: str, context_results: list):
    """
    Sends the claim and scraped web context to a local Ollama instance 
    (running gemma2:2b or similar) for a final truth verdict.
    """
    if not context_results:
        return {
            "verdict": "UNKNOWN",
            "confidence": 50.0,
            "explanation": "No search results found to verify this claim."
        }

    # Format context for the LLM
    context_text = ""
    for i, res in enumerate(context_results):
        context_text += f"\nSource {i+1} ({res['title']}): {res['snippet']}"

    prompt = f"""
Analyze the following news claim based on real-time search results AND your internal common sense.

CLAIM: "{claim}"

SEARCH RESULTS:
{context_text}

INSTRUCTIONS:
1. Determine if the claim is TRUE or FALSE.
2. CRITICAL: If the claim involves scientifically impossible or highly improbable events (e.g., Aliens, Zombies, Magic) and the SEARCH RESULTS do not provide definitive proof, mark it as FALSE.
3. If the writing is sensationalist but search results are missing, be highly skeptical.
4. Provide a brief 2-sentence explanation of your reasoning.
5. Output your response in the following JSON format:
{{
  "verdict": "TRUE/FALSE/PARTIALLY TRUE",
  "confidence": (0-100 score),
  "explanation": "..."
}}
"""

    try:
        logger.info("Sending request to local Ollama (Gemma)...")
        # We assume the user has run 'ollama run gemma2:2b'
        response = ollama.chat(model='gemma2:2b', messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        
        # Parse the response (Ollama returns a dict, we extract the content string)
        content = response['message']['content']
        logger.info(f"Ollama raw response: {content}")
        
        # Simple extraction logic (LLMs sometimes wrap JSON in markdown blocks)
        import json
        import re
        
        # Look for JSON block
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            return data
        else:
            # Fallback if no JSON found
            return {
                "verdict": "UNVERIFIED",
                "confidence": 50.0,
                "explanation": "LLM returned a non-structured response."
            }

    except Exception as e:
        logger.error(f"Ollama Error: {e}")
        return {
            "verdict": "ERROR",
            "confidence": 0.0,
            "explanation": f"Failed to connect to local Ollama server: {str(e)}"
        }

if __name__ == "__main__":
    # Standalone test
    test_claim = "RCB won IPL 2025"
    test_context = [
        {"title": "IPL 2025 Winner List", "snippet": "The IPL 2025 season has not yet concluded. The final is scheduled for late May 2025."},
        {"title": "RCB Match Schedule", "snippet": "Royal Challengers Bangalore (RCB) are currently playing their league stage matches in the 2025 season."}
    ]
    print(evaluate_claim_with_ollama(test_claim, test_context))
