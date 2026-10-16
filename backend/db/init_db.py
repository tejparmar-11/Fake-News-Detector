"""Initialize database tables and seed with demo data."""
from db.database import engine, SessionLocal
from db import models
from db.seed import seed_all


def init_db():
    print("📦 Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")

    db = SessionLocal()
    try:
        # Only seed if trending table is empty
        count = db.query(models.TrendingFakeNews).count()
        if count == 0:
            print("🌱 Seeding database with demo data...")
            seed_all(db)
            print("✅ Database seeded successfully.")
        else:
            print("ℹ️  Database already seeded, skipping.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
