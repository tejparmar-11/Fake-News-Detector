import os
import pandas as pd
from datasets import load_dataset
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_and_save_dataset():
    """
    Downloads a large deep learning ready dataset for fake news detection
    and saves it physically to the local hard drive.
    """
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    
    csv_path = os.path.join(data_dir, "large_fake_news_dataset.csv")
    
    if os.path.exists(csv_path):
        logger.info(f"Dataset already exists at {csv_path}. Skipping download.")
        return
        
    logger.info("Initializing download of the massive LIAR real/fake news dataset...")
    
    try:
        # Load the dataset from HuggingFace
        # 'GonzaloA/fake_news' dataset contains thousands of news articles with real/fake labels
        dataset = load_dataset("GonzaloA/fake_news", split="train")
        
        # Convert to Pandas DataFrame
        df = pd.DataFrame(dataset)
        
        # We process the labels to simplify: REAL vs FAKE
        # GonzaloA/fake_news labels: 0=Fake, 1=True
        def map_label(label):
            if label == 0:
                return "FAKE"
            else:
                return "REAL"
                
        df['verdict'] = df['label'].apply(map_label)
        
        # Keep relevant columns
        df = df[['text', 'label', 'verdict', 'title']]
        
        logger.info(f"Successfully downloaded {len(df)} curated real/fake news records.")
        
        # Save physically to CSV
        logger.info(f"Saving to {csv_path}...")
        df.to_csv(csv_path, index=False)
        
        logger.info("✅ Deep Learning Dataset downloaded and saved locally!")
        
    except Exception as e:
        logger.error(f"Failed to fetch dataset: {e}")

if __name__ == "__main__":
    download_and_save_dataset()
