import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Database URL: default to SQLite for local lightweight development, overridable via env
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'nexwatch.db'}")

# Anomaly detection thresholds
SPEED_THRESHOLD_KMH = float(os.getenv("SPEED_THRESHOLD_KMH", "120.0"))
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.60"))

# Paths
CAMERA_CONFIG_PATH = os.getenv("CAMERA_CONFIG_PATH", str(BASE_DIR / "data" / "camera_config.json"))
VIDEO_DIR = os.getenv("VIDEO_DIR", str(BASE_DIR / "data" / "camera_videos"))
CROPS_DIR = os.getenv("CROPS_DIR", str(BASE_DIR / "data" / "crops"))

# Ensure directories exist
os.makedirs(CROPS_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)
