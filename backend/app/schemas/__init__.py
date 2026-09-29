from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CameraResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    camera_id: str
    name: str
    lat: float
    lon: float
    road_segment: Optional[str] = None

class DetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plate_text: str
    ocr_confidence: float
    camera_id: str
    camera_name: str
    lat: float
    lon: float
    detected_at: datetime
    vehicle_crop_url: Optional[str] = None
    plate_crop_url: Optional[str] = None
    color_guess: Optional[str] = None

class DetectionSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plate_text: str
    camera_id: str
    camera_name: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    detected_at: datetime
    vehicle_crop_url: Optional[str] = None
    color_guess: Optional[str] = None

class AnomalyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plate_text: str
    implied_speed_kmh: float
    embedding_similarity: float
    detection_a: DetectionSummary
    detection_b: DetectionSummary
    flagged_at: datetime
    status: str

class AcknowledgeRequest(BaseModel):
    status: str  # "acknowledged" | "false_positive"

class AcknowledgeResponse(BaseModel):
    id: int
    status: str

class NextCameraPrediction(BaseModel):
    camera_id: str
    camera_name: str
    probability: float

class DensityResponse(BaseModel):
    hours: List[int]
    passenger: List[int]
    freight: List[int]

class ODLink(BaseModel):
    source: str
    target: str
    value: int

class ODFlowResponse(BaseModel):
    nodes: List[str]
    links: List[ODLink]

class RouteSpeed(BaseModel):
    name: str
    speeds_by_hour: List[float]
    speed_limit: float

class SpeedByRouteResponse(BaseModel):
    routes: List[RouteSpeed]
