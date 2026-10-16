import os
import pandas as pd
import torch
from datasets import load_dataset, Dataset, concatenate_datasets
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer
)

def load_local_csv(path, text_col, label_col):
    """Gracefully load a local CSV if it exists."""
    if not os.path.exists(path):
        print(f"[WARN] Local dataset not found at {path}. Skipping.")
        return None
    try:
        df = pd.read_csv(path)
        if text_col not in df.columns or label_col not in df.columns:
            print(f"[WARN] Missing required columns in {path}. Skipping.")
            return None
        # Drop NaNs and ensure string
        df = df.dropna(subset=[text_col, label_col])
        df[text_col] = df[text_col].astype(str)
        # Assuming label 0 = real/credible, 1 = fake/unreliable
        df = df[[text_col, label_col]].rename(columns={text_col: "text", label_col: "label"})
        return Dataset.from_pandas(df, preserve_index=False)
    except Exception as e:
        print(f"[ERR] Failed to load {path}: {e}")
        return None

def preprocess_liar(example):
    # LIAR labels: 0=pants-fire, 1=false, 2=barely-true, 3=half-true, 4=mostly-true, 5=true
    # We map to binary: FAKE (1) if label <= 2, REAL (0) if label >= 3
    is_fake = 1 if example['label'] <= 2 else 0
    return {"text": str(example["statement"]), "label": is_fake}

def build_combined_dataset():
    datasets = []
    
    # 1. LIAR (from HuggingFace)
    print("Loading LIAR dataset...")
    try:
        liar = load_dataset('liar', split='train')
        liar = liar.map(preprocess_liar)
        # Keep only text and label columns
        liar = liar.remove_columns([c for c in liar.column_names if c not in ["text", "label"]])
        datasets.append(liar)
    except Exception as e:
        print(f"[ERR] Failed to load LIAR: {e}")

    # 2. Kaggle Fake News Dataset (expected at ./data/kaggle/train.csv)
    # text column: 'text', label column: 'label' (1=fake, 0=real)
    print("Loading Kaggle dataset...")
    kaggle_ds = load_local_csv("data/kaggle/train.csv", text_col="text", label_col="label")
    if kaggle_ds:
        datasets.append(kaggle_ds)

    # 3. FakeNewsNet Dataset (expected at ./data/fakenewsnet/politifact_gossipcop.csv)
    print("Loading FakeNewsNet dataset...")
    fnn_ds = load_local_csv("data/fakenewsnet/politifact_gossipcop.csv", text_col="title", label_col="fake")
    if fnn_ds:
        datasets.append(fnn_ds)

    if not datasets:
        raise ValueError("No datasets loaded successfully. Cannot train.")

    # Combine datasets
    combined = concatenate_datasets(datasets)
    print(f"Combined dataset size: {len(combined)} examples")
    return combined.shuffle(seed=42)

def main():
    model_name = "distilbert-base-uncased"
    output_dir = "./local_models/distilbert-fake-news"

    dataset = build_combined_dataset()

    # Split to train/eval
    split = dataset.train_test_split(test_size=0.1)
    train_dataset = split['train']
    eval_dataset = split['test']

    print(f"Loading tokenizer: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=512)

    print("Tokenizing datasets...")
    tokenized_train = train_dataset.map(tokenize_function, batched=True)
    tokenized_eval = eval_dataset.map(tokenize_function, batched=True)

    print(f"Loading model: {model_name}")
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

    training_args = TrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=3,
        weight_decay=0.01,
        save_strategy="epoch",
        load_best_model_at_end=True,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_train,
        eval_dataset=tokenized_eval,
    )

    print("Starting training...")
    trainer.train()

    print(f"Saving final model to {output_dir}")
    trainer.save_model(output_dir)
    tokenizer.save_pretrained(output_dir)
    print("Training complete!")

if __name__ == "__main__":
    main()
