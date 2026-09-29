from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.db.session import get_db
from backend.app.models.camera import Camera
from backend.app.models.detection import Detection
from backend.app.schemas import CameraResponse, DetectionResponse

router = APIRouter()

@router.get("/cameras", response_model=List[CameraResponse])
def get_cameras(db: Session = Depends(get_db)):
    """Returns list of all active traffic cameras with coordinates and road segments."""
    cameras = db.query(Camera).all()
    return cameras

@router.get("/detections", response_model=List[DetectionResponse])
def get_detections_trajectory(
    plate: Optional[str] = Query(None, description="License plate to search for"),
    camera_id: Optional[str] = Query(None, description="Optional filter by camera ID"),
    limit: int = Query(100, description="Max detections to return"),
    db: Session = Depends(get_db)
):
    """
    Returns vehicle detections, sorted chronologically ascending by detected_at.
    When plate is provided, returns the vehicle's chronological corridor trajectory.
    """
    query = db.query(Detection).join(Camera, Detection.camera_id == Camera.camera_id)

    if plate:
        clean_plate = plate.replace(" ", "").upper()
        query = query.filter(Detection.plate_text == clean_plate)

    if camera_id:
        query = query.filter(Detection.camera_id == camera_id)

    detections = query.order_by(Detection.detected_at.asc()).limit(limit).all()

    results = []
    for d in detections:
        results.append(DetectionResponse(
            id=d.id,
            plate_text=d.plate_text,
            ocr_confidence=d.ocr_confidence,
            camera_id=d.camera_id,
            camera_name=d.camera.name if d.camera else d.camera_id,
            lat=d.camera.lat if d.camera else 0.0,
            lon=d.camera.lon if d.camera else 0.0,
            detected_at=d.detected_at,
            vehicle_crop_url=f"/crops/{d.vehicle_crop_path}" if d.vehicle_crop_path else None,
            plate_crop_url=f"/crops/{d.plate_crop_path}" if d.plate_crop_path else None,
            color_guess=d.color_guess
        ))

    return results
