from typing import Dict, List, Any, Optional
from collections import defaultdict
from sqlalchemy.orm import Session
from backend.app.models.detection import Detection
from backend.app.models.camera import Camera

class MarkovCorridorPredictor:
    def __init__(self):
        self.transition_counts: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        self.transition_probs: Dict[str, Dict[str, float]] = defaultdict(lambda: defaultdict(float))
        self.is_trained: bool = False

    def train_from_db(self, db: Session):
        """
        Builds transition_counts[camera_from][camera_to] by walking each
        plate's detections in time order and incrementing the count for each
        consecutive camera pair. Normalizes each row to probabilities.
        """
        self.transition_counts = defaultdict(lambda: defaultdict(int))
        self.transition_probs = defaultdict(lambda: defaultdict(float))

        # Fetch all detections ordered by plate and time
        detections: List[Detection] = (
            db.query(Detection)
            .order_by(Detection.plate_text, Detection.detected_at.asc())
            .all()
        )

        # Group by plate_text
        plate_groups: Dict[str, List[Detection]] = defaultdict(list)
        for det in detections:
            plate_groups[det.plate_text].append(det)

        # Walk each plate's chronological sightings
        for plate, sightings in plate_groups.items():
            for i in range(len(sightings) - 1):
                cam_from = sightings[i].camera_id
                cam_to = sightings[i + 1].camera_id
                if cam_from != cam_to:
                    self.transition_counts[cam_from][cam_to] += 1

        # Normalize rows to transition probabilities P(cam_to | cam_from)
        for cam_from, targets in self.transition_counts.items():
            total = sum(targets.values())
            if total > 0:
                for cam_to, count in targets.items():
                    self.transition_probs[cam_from][cam_to] = round(count / total, 4)

        self.is_trained = True

    def predict_next_camera(self, plate_text: str, db: Session) -> List[Dict[str, Any]]:
        """
        Predicts next sighting camera for a vehicle given its last known location.
        Returns: [{camera_id, camera_name, probability}] sorted descending by probability.
        """
        self.train_from_db(db)

        # Find latest sighting of this plate
        latest: Optional[Detection] = (
            db.query(Detection)
            .filter(Detection.plate_text == plate_text)
            .order_by(Detection.detected_at.desc())
            .first()
        )

        if not latest:
            return []

        last_cam_id = latest.camera_id
        probs = self.transition_probs.get(last_cam_id, {})

        # If no empirical transitions recorded yet from this terminal camera, use road network topology priors
        if not probs:
            TOPOLOGY_TRANSITIONS = {
                "CAM-ECT-002": {"CAM-SLK-009": 0.85, "CAM-KOR-047": 0.15},
                "CAM-SLK-009": {"CAM-KOR-047": 0.72, "CAM-402": 0.18, "CAM-IND-110": 0.10},
                "CAM-KOR-047": {"CAM-IND-110": 0.65, "CAM-MGR-088": 0.25, "CAM-402": 0.10},
                "CAM-IND-110": {"CAM-MGR-088": 0.60, "CAM-ORR-204": 0.25, "CAM-WHT-031": 0.15},
                "CAM-MGR-088": {"CAM-ORR-204": 0.70, "CAM-402": 0.20, "CAM-WHT-031": 0.10},
                "CAM-ORR-204": {"CAM-KIA-01": 0.65, "CAM-YEL-05": 0.25, "CAM-MEC-12": 0.10},
                "CAM-WHT-031": {"CAM-ORR-204": 0.55, "CAM-IND-110": 0.30, "CAM-MGR-088": 0.15},
                "CAM-402": {"CAM-MGR-088": 0.55, "CAM-ORR-204": 0.30, "CAM-118": 0.15},
                "CAM-118": {"CAM-SLK-009": 0.60, "CAM-KOR-047": 0.40},
                "CAM-889": {"CAM-IND-110": 0.58, "CAM-WHT-031": 0.42},
            }
            probs = TOPOLOGY_TRANSITIONS.get(last_cam_id, {})

        # Fetch all cameras for name lookup
        all_cameras = {c.camera_id: c.name for c in db.query(Camera).all()}
        # Standard known names for external corridor links
        known_names = {
            "CAM-KIA-01": "Kempegowda Intl Airport Expressway (NH-44)",
            "CAM-YEL-05": "Yelahanka Flyover / Doddaballapur Bypass",
            "CAM-MEC-12": "Mekhri Circle / Bellary Road Inbound"
        }
        all_cameras.update(known_names)

        results = []
        for target_cam_id, prob in probs.items():
            results.append({
                "camera_id": target_cam_id,
                "camera_name": all_cameras.get(target_cam_id, target_cam_id),
                "probability": round(prob, 4)
            })

        # Sort descending by probability
        results.sort(key=lambda x: x["probability"], reverse=True)
        return results

    def get_debug_matrix(self, db: Session) -> Dict[str, Any]:
        """Returns the full transition counts matrix and probabilities for inspection."""
        self.train_from_db(db)
        return {
            "counts": {k: dict(v) for k, v in self.transition_counts.items()},
            "probabilities": {k: dict(v) for k, v in self.transition_probs.items()}
        }

# Global predictor instance
_predictor_instance = None

def get_predictor() -> MarkovCorridorPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = MarkovCorridorPredictor()
    return _predictor_instance
