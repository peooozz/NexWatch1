from sqlalchemy import Column, String, Float
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class Camera(Base):
    __tablename__ = "cameras"

    camera_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    road_segment = Column(String, nullable=True)

    detections = relationship("Detection", back_populates="camera")
