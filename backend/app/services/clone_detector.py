import math
from datetime import datetime
from typing import Optional, Callable, Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.config import SPEED_THRESHOLD_KMH, SIMILARITY_THRESHOLD
from backend.app.models.detection import Detection
from backend.app.models.camera import Camera
from backend.app.models.anomaly import Anomaly
from backend.app.services.fingerprint import VehicleFingerprinter

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS coordinates in kilometers.
    """
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def detect_clone_anomaly(
    new_detection: Detection,
    db: Session,
    broadcast_callback: Optional[Callable[[Dict[str, Any]], Any]] = None
) -> Optional[Anomaly]:
    """
    M5 Anomaly Detection Engine:
    Checks if a newly inserted detection creates a spatio-temporal impossibility
    with any recent detection of the same plate text.
    Condition: implied_speed > SPEED_THRESHOLD_KMH and embedding_similarity < SIMILARITY_THRESHOLD
    """
    # Find all prior detections with the same plate text
    prior_detections: List[Detection] = (
        db.query(Detection)
        .filter(Detection.plate_text == new_detection.plate_text)
        .filter(Detection.id != new_detection.id)
        .order_by(Detection.detected_at.desc())
        .all()
    )

    if not prior_detections:
        return None

    # Get camera coordinates for new detection
    cam_new: Optional[Camera] = db.query(Camera).filter(Camera.camera_id == new_detection.camera_id).first()
    if not cam_new:
        return None

    for prior in prior_detections:
        cam_prior: Optional[Camera] = db.query(Camera).filter(Camera.camera_id == prior.camera_id).first()
        if not cam_prior:
            continue

        # Calculate spatial distance (km)
        dist_km = haversine_distance(cam_prior.lat, cam_prior.lon, cam_new.lat, cam_new.lon)

        # Calculate time difference (hours)
        time_diff_sec = abs((new_detection.detected_at - prior.detected_at).total_seconds())
        time_hr = time_diff_sec / 3600.0

        if time_hr < 1e-5:
            # Virtually simultaneous detections at different locations
            implied_speed = 999.0 if dist_km > 0.05 else 0.0
        else:
            implied_speed = dist_km / time_hr

        # Calculate embedding similarity
        if prior.vehicle_embedding and new_detection.vehicle_embedding:
            similarity = VehicleFingerprinter.cosine_similarity(
                prior.vehicle_embedding, new_detection.vehicle_embedding
            )
        else:
            similarity = 1.0  # default to pass if embedding unavailable

        # Check threshold condition
        if implied_speed > SPEED_THRESHOLD_KMH and similarity < SIMILARITY_THRESHOLD:
            # Chronological order: A is earlier, B is later
            if prior.detected_at <= new_detection.detected_at:
                det_a, det_b = prior, new_detection
            else:
                det_a, det_b = new_detection, prior

            # Check if this anomaly was already flagged
            existing = (
                db.query(Anomaly)
                .filter(Anomaly.detection_id_a == det_a.id)
                .filter(Anomaly.detection_id_b == det_b.id)
                .first()
            )
            if existing:
                return existing

            anomaly = Anomaly(
                plate_text=new_detection.plate_text,
                detection_id_a=det_a.id,
                detection_id_b=det_b.id,
                implied_speed_kmh=round(implied_speed, 2),
                embedding_similarity=round(similarity, 4),
                flagged_at=datetime.utcnow(),
                status="open"
            )
            db.add(anomaly)
            db.commit()
            db.refresh(anomaly)

            # Build alert payload for live WebSocket broadcast
            if broadcast_callback:
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
                        "camera_name": cam_prior.name if det_a.camera_id == cam_prior.camera_id else cam_new.name,
                        "lat": cam_prior.lat if det_a.camera_id == cam_prior.camera_id else cam_new.lat,
                        "lon": cam_prior.lon if det_a.camera_id == cam_prior.camera_id else cam_new.lon,
                        "detected_at": det_a.detected_at.isoformat(),
                        "vehicle_crop_url": f"/crops/{det_a.vehicle_crop_path}" if det_a.vehicle_crop_path else None,
                        "color_guess": det_a.color_guess
                    },
                    "detection_b": {
                        "id": det_b.id,
                        "plate_text": det_b.plate_text,
                        "camera_id": det_b.camera_id,
                        "camera_name": cam_new.name if det_b.camera_id == cam_new.camera_id else cam_prior.name,
                        "lat": cam_new.lat if det_b.camera_id == cam_new.camera_id else cam_prior.lat,
                        "lon": cam_new.lon if det_b.camera_id == cam_new.camera_id else cam_prior.lon,
                        "detected_at": det_b.detected_at.isoformat(),
                        "vehicle_crop_url": f"/crops/{det_b.vehicle_crop_path}" if det_b.vehicle_crop_path else None,
                        "color_guess": det_b.color_guess
                    }
                }
                broadcast_callback({"type": "new_anomaly", "payload": payload})

            return anomaly

    return None
