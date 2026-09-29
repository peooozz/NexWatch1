from sqlalchemy import Column, String, DateTime
from backend.app.db.session import Base
from datetime import datetime

class Blacklist(Base):
    __tablename__ = "blacklist"

    plate_text = Column(String, primary_key=True, index=True)
    reason = Column(String, nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)
