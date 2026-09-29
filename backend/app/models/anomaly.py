from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.session import Base
from datetime import datetime

class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    plate_text = Column(String, nullable=False, index=True)
    detection_id_a = Column(Integer, ForeignKey("detections.id"), nullable=False)
    detection_id_b = Column(Integer, ForeignKey("detections.id"), nullable=False)
    implied_speed_kmh = Column(Float, nullable=False)
    embedding_similarity = Column(Float, nullable=False)
    flagged_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(String, default="open")  # open | acknowledged | false_positive

    detection_a = relationship("Detection", foreign_keys=[detection_id_a])
    detection_b = relationship("Detection", foreign_keys=[detection_id_b])
