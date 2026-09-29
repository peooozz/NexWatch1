from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.session import Base
from datetime import datetime

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    plate_text = Column(String, nullable=False, index=True)
    ocr_confidence = Column(Float, nullable=False)
    camera_id = Column(String, ForeignKey("cameras.camera_id"), nullable=False)
    detected_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    vehicle_embedding = Column(JSON, nullable=True)  # List[float] (512-dim ResNet18)
    vehicle_crop_path = Column(String, nullable=True)
    plate_crop_path = Column(String, nullable=True)
    color_guess = Column(String, nullable=True)

    camera = relationship("Camera", back_populates="detections")
