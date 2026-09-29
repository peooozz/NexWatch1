from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from backend.app.db.session import get_db
from backend.app.models.anomaly import Anomaly
from backend.app.models.detection import Detection
from backend.app.models.camera import Camera
from backend.app.schemas import AnomalyResponse, DetectionSummary, AcknowledgeRequest, AcknowledgeResponse
from backend.app.services.clone_detector import detect_clone_anomaly
from backend.app.api.routes.alerts_ws import manager
from backend.app.services.fingerprint import get_fingerprinter
import numpy as np

router = APIRouter()

def format_detection_summary(det: Optional[Detection], db: Session) -> Optional[DetectionSummary]:
    if not det:
        return None
    cam = db.query(Camera).filter(Camera.camera_id == det.camera_id).first()
    return DetectionSummary(
        id=det.id,
        plate_text=det.plate_text,
        camera_id=det.camera_id,
        camera_name=cam.name if cam else det.camera_id,
        lat=cam.lat if cam else None,
        lon=cam.lon if cam else None,
        detected_at=det.detected_at,
        vehicle_crop_url=f"/crops/{det.vehicle_crop_path}" if det.vehicle_crop_path else None,
        color_guess=det.color_guess
    )

@router.get("", response_model=List[AnomalyResponse])
def get_anomalies(
    status: Optional[str] = Query(None, description="Filter by status: open | acknowledged | false_positive"),
    db: Session = Depends(get_db)
):
    """Returns list of flagged clone anomalies."""
    query = db.query(Anomaly)
    if status:
        query = query.filter(Anomaly.status == status)

    anomalies = query.order_by(Anomaly.flagged_at.desc()).all()

    results = []
    for a in anomalies:
        det_a = db.query(Detection).filter(Detection.id == a.detection_id_a).first()
        det_b = db.query(Detection).filter(Detection.id == a.detection_id_b).first()
        results.append(AnomalyResponse(
            id=a.id,
            plate_text=a.plate_text,
            implied_speed_kmh=a.implied_speed_kmh,
            embedding_similarity=a.embedding_similarity,
            detection_a=format_detection_summary(det_a, db),
            detection_b=format_detection_summary(det_b, db),
            flagged_at=a.flagged_at,
            status=a.status
        ))

    return results

@router.post("/{anomaly_id}/acknowledge", response_model=AcknowledgeResponse)
def acknowledge_anomaly(
    anomaly_id: int,
    request: AcknowledgeRequest,
    db: Session = Depends(get_db)
):
    """Updates the status of an anomaly to 'acknowledged' or 'false_positive'."""
    anomaly = db.query(Anomaly).filter(Anomaly.id == anomaly_id).first()
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")

    if request.status not in ["acknowledged", "false_positive", "open"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    anomaly.status = request.status
    db.commit()
    db.refresh(anomaly)
    return AcknowledgeResponse(id=anomaly.id, status=anomaly.status)

@router.post("/inject-synthetic-clone", response_model=AnomalyResponse)
async def inject_synthetic_clone(db: Session = Depends(get_db)):
    """
    Demo helper: Injects a synthetic pair of detections sharing the same plate
    text ('KA01AB1234') across geographically distant cameras with an impossible
    time gap (implied speed > 300 km/h) and different vehicle embeddings.
    Fires the clone anomaly detector and broadcasts over WebSocket!
    """
    fp = get_fingerprinter()
    plate = "KA01AB1234"
    now = datetime.utcnow()

    # Detection A: White Sedan at Silk Board Junction (CAM-001)
    # Detection B: Red Commercial Truck 18 km away at KR Puram Bridge (CAM-005) only 2 minutes later!
    # Implied speed = 18.2 km / (2/60 hr) = 546 km/h!
    emb_white_sedan = fp.extract_embedding("data/test_crops/car1_white_sedan_cropA.jpg")
    emb_red_truck = fp.extract_embedding("data/test_crops/car3_red_truck.jpg")

    det_a = Detection(
        plate_text=plate,
        ocr_confidence=0.97,
        camera_id="CAM-001",
        detected_at=now - timedelta(minutes=2),
        vehicle_embedding=emb_white_sedan,
        vehicle_crop_path="car1_white_sedan_cropA.jpg",
        plate_crop_path="car1_white_sedan_cropA.jpg",
        color_guess="White"
    )
    db.add(det_a)
    db.commit()
    db.refresh(det_a)

    det_b = Detection(
        plate_text=plate,
        ocr_confidence=0.96,
        camera_id="CAM-005",
        detected_at=now,
        vehicle_embedding=emb_red_truck,
        vehicle_crop_path="car3_red_truck.jpg",
        plate_crop_path="car3_red_truck.jpg",
        color_guess="Red"
    )
    db.add(det_b)
    db.commit()
    db.refresh(det_b)

    # Detect clone anomaly
    anomaly = detect_clone_anomaly(det_b, db)
    if not anomaly:
        raise HTTPException(status_code=500, detail="Failed to flag synthetic anomaly")

    cam_a = db.query(Camera).filter(Camera.camera_id == det_a.camera_id).first()
    cam_b = db.query(Camera).filter(Camera.camera_id == det_b.camera_id).first()

    payload = {
        "id": anomaly.id,
        "plate_text": anomaly.plate_text,
        "implied_speed_kmh": anomaly.implied_speed_kmh,
        "embedding_similarity": anomaly.embedding_similarity,
        "flagged_at": anomaly.flagged_at.isoformat(),
        "status": anomaly.status,
        "detection_a": {
            "id": det_a.id,
            "plate_text": det_a.plate_text,
            "camera_id": det_a.camera_id,
            "camera_name": cam_a.name if cam_a else det_a.camera_id,
            "lat": cam_a.lat if cam_a else None,
            "lon": cam_a.lon if cam_a else None,
            "detected_at": det_a.detected_at.isoformat(),
            "vehicle_crop_url": f"/crops/{det_a.vehicle_crop_path}" if det_a.vehicle_crop_path else None,
            "color_guess": det_a.color_guess
        },
        "detection_b": {
            "id": det_b.id,
            "plate_text": det_b.plate_text,
            "camera_id": det_b.camera_id,
            "camera_name": cam_b.name if cam_b else det_b.camera_id,
            "lat": cam_b.lat if cam_b else None,
            "lon": cam_b.lon if cam_b else None,
            "detected_at": det_b.detected_at.isoformat(),
            "vehicle_crop_url": f"/crops/{det_b.vehicle_crop_path}" if det_b.vehicle_crop_path else None,
            "color_guess": det_b.color_guess
        }
    }

    # Broadcast directly over WebSocket
    await manager.broadcast({"type": "new_anomaly", "payload": payload})

    return AnomalyResponse(
        id=anomaly.id,
        plate_text=anomaly.plate_text,
        implied_speed_kmh=anomaly.implied_speed_kmh,
        embedding_similarity=anomaly.embedding_similarity,
        detection_a=format_detection_summary(det_a, db),
        detection_b=format_detection_summary(det_b, db),
        flagged_at=anomaly.flagged_at,
        status=anomaly.status
    )
