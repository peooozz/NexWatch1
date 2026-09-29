import os
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.config import CAMERA_CONFIG_PATH, CROPS_DIR
from backend.app.db.session import SessionLocal, Base, engine
from backend.app.models.camera import Camera
from backend.app.models.detection import Detection
from backend.app.models.anomaly import Anomaly
from backend.app.services.fingerprint import get_fingerprinter

def seed_complete_demo_data():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    fp = get_fingerprinter()

    try:
        # 1. Update camera_config.json with comprehensive Bengaluru ATCS node network
        cameras_dict = {
            "CAM-ECT-002": {
                "name": "Electronic City Elevated Tollway",
                "lat": 12.8452,
                "lon": 77.6602,
                "road_segment": "Hosur Expressway Sector 1"
            },
            "CAM-SLK-009": {
                "name": "Central Silk Board Flyover",
                "lat": 12.9177,
                "lon": 77.6238,
                "road_segment": "Outer Ring Road Sector 1"
            },
            "CAM-KOR-047": {
                "name": "80 Feet Road, Koramangala",
                "lat": 12.9352,
                "lon": 77.6245,
                "road_segment": "Koramangala Sony World Cross"
            },
            "CAM-IND-110": {
                "name": "100 Feet Road, Indiranagar",
                "lat": 12.9698,
                "lon": 77.6410,
                "road_segment": "Indiranagar Domlur Link"
            },
            "CAM-MGR-088": {
                "name": "MG Road Trinity Circle",
                "lat": 12.9734,
                "lon": 77.6160,
                "road_segment": "CBD Core Corridor"
            },
            "CAM-ORR-204": {
                "name": "Hebbal Outer Ring Road",
                "lat": 13.0358,
                "lon": 77.5970,
                "road_segment": "Airport Expressway Incline"
            },
            "CAM-WHT-031": {
                "name": "Whitefield Main Road (ITPL Gate)",
                "lat": 12.9860,
                "lon": 77.7310,
                "road_segment": "ITPL Tech Corridor"
            },
            "CAM-402": {
                "name": "Midtown Core Sector 04",
                "lat": 12.9610,
                "lon": 77.6320,
                "road_segment": "Core Metronet Spur"
            },
            "CAM-118": {
                "name": "Harbor / Lake Tunnel Bypass",
                "lat": 12.9250,
                "lon": 77.6550,
                "road_segment": "Harbor Express Bypass"
            },
            "CAM-889": {
                "name": "Old Airport Road Intercept Gate",
                "lat": 12.9580,
                "lon": 77.6710,
                "road_segment": "HAL Airport Corridor"
            }
        }

        with open(CAMERA_CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(cameras_dict, f, indent=2)

        # Upsert cameras into DB
        for cid, info in cameras_dict.items():
            cam = db.query(Camera).filter(Camera.camera_id == cid).first()
            if not cam:
                cam = Camera(camera_id=cid)
                db.add(cam)
            cam.name = info["name"]
            cam.lat = info["lat"]
            cam.lon = info["lon"]
            cam.road_segment = info["road_segment"]
        db.commit()

        # Clear previous anomalies and detections to guarantee clean state
        db.query(Anomaly).delete()
        db.query(Detection).delete()
        db.commit()

        # Generate sample embeddings
        emb_white_car = fp.extract_embedding("data/test_crops/car1_white_sedan_cropA.jpg")
        emb_clone_diff = fp.extract_embedding("data/test_crops/car3_red_truck.jpg")

        # 2. Seed Trajectory for KA01MJ5521 (6 chronological crossings matching Stitch 02-vehicle-search)
        today = datetime.utcnow().replace(hour=8, minute=14, second=0, microsecond=0)

        crossings_5521 = [
            {
                "camera_id": "CAM-ECT-002",
                "time": today,
                "conf": 0.990,
                "crop": "car1_white_sedan_cropA.jpg",
                "color": "Polar White",
                "speed": 68
            },
            {
                "camera_id": "CAM-SLK-009",
                "time": today + timedelta(minutes=14),
                "conf": 0.968,
                "crop": "car1_white_sedan_cropA.jpg",
                "color": "Polar White",
                "speed": 18
            },
            {
                "camera_id": "CAM-KOR-047",
                "time": today + timedelta(minutes=34),
                "conf": 0.994,
                "crop": "car1_white_sedan_cropA.jpg",
                "color": "Polar White",
                "speed": 36
            },
            {
                "camera_id": "CAM-IND-110",
                "time": today + timedelta(minutes=48),
                "conf": 0.979,
                "crop": "car1_white_sedan_cropA.jpg",
                "color": "Polar White",
                "speed": 18
            },
            {
                "camera_id": "CAM-MGR-088",
                "time": today + timedelta(minutes=66, seconds=14),
                "conf": 0.986,
                "crop": "car1_white_sedan_cropA.jpg",
                "color": "Polar White",
                "speed": 52
            },
            {
                "camera_id": "CAM-ORR-204",
                "time": today + timedelta(minutes=78),
                "conf": 0.991,
                "crop": "car1_white_sedan_cropB.jpg",
                "color": "Polar White",
                "speed": 34
            }
        ]

        dets_5521 = []
        for c in crossings_5521:
            det = Detection(
                plate_text="KA01MJ5521",
                ocr_confidence=c["conf"],
                camera_id=c["camera_id"],
                detected_at=c["time"],
                vehicle_embedding=emb_white_car,
                vehicle_crop_path=c["crop"],
                plate_crop_path=c["crop"],
                color_guess=c["color"]
            )
            db.add(det)
            db.commit()
            db.refresh(det)
            dets_5521.append(det)

        # 3. Seed Concurrent Clone Detection Sighting B for KA01MJ5521 at Whitefield (CAM-WHT-031)
        # Sighting A at CAM-MGR-088 (09:20:14) -> Sighting B at CAM-WHT-031 (09:23:42)
        # Time delta = 3m 28s (208s) across 18.2 km -> Implied Speed = 315 km/h!
        det_clone_b = Detection(
            plate_text="KA01MJ5521",
            ocr_confidence=0.975,
            camera_id="CAM-WHT-031",
            detected_at=crossings_5521[4]["time"] + timedelta(minutes=3, seconds=28),
            vehicle_embedding=emb_clone_diff,
            vehicle_crop_path="car2_blue_suv.jpg",
            plate_crop_path="car2_blue_suv.jpg",
            color_guess="Off-White / Dull Silver"
        )
        db.add(det_clone_b)
        db.commit()
        db.refresh(det_clone_b)

        # Create Anomaly Incident for KA01MJ5521
        anomaly_5521 = Anomaly(
            plate_text="KA01MJ5521",
            detection_id_a=dets_5521[4].id,  # CAM-MGR-088
            detection_id_b=det_clone_b.id,   # CAM-WHT-031
            implied_speed_kmh=315.0,
            embedding_similarity=0.4820,
            flagged_at=datetime.utcnow(),
            status="open"
        )
        db.add(anomaly_5521)

        # 4. Seed other demo plates (KA01AB1234, KA03MG4412, KA53TR7710)
        plate_routes = [
            ("KA01AB1234", [("CAM-ECT-002", 0), ("CAM-SLK-009", 12), ("CAM-KOR-047", 25), ("CAM-MGR-088", 45)], "Silver/White"),
            ("KA03MG4412", [("CAM-SLK-009", 5), ("CAM-KOR-047", 18), ("CAM-IND-110", 35)], "Dark Gray SUV"),
            ("KA53TR7710", [("CAM-ECT-002", 2), ("CAM-SLK-009", 20), ("CAM-ORR-204", 60)], "Commercial Freight"),
            ("KA05MH8821", [("CAM-IND-110", 10), ("CAM-MGR-088", 22)], "Black Sedan")
        ]

        for p_text, r_stops, color in plate_routes:
            for cam_id, min_off in r_stops:
                det = Detection(
                    plate_text=p_text,
                    ocr_confidence=0.985,
                    camera_id=cam_id,
                    detected_at=today + timedelta(minutes=min_off + 2),
                    vehicle_embedding=emb_white_car,
                    vehicle_crop_path="car1_white_sedan_cropA.jpg",
                    plate_crop_path="car1_white_sedan_cropA.jpg",
                    color_guess=color
                )
                db.add(det)

        # Additional anomaly for 7XYZ892 / CAM-402 & CAM-204 (Midtown Core impossible velocity)
        det_7xyz_a = Detection(
            plate_text="7XYZ892",
            ocr_confidence=0.984,
            camera_id="CAM-402",
            detected_at=datetime.utcnow() - timedelta(minutes=2),
            vehicle_embedding=emb_white_car,
            vehicle_crop_path="car1_white_sedan_cropA.jpg",
            plate_crop_path="car1_white_sedan_cropA.jpg",
            color_guess="Black Sedan"
        )
        db.add(det_7xyz_a)
        db.commit()
        db.refresh(det_7xyz_a)

        det_7xyz_b = Detection(
            plate_text="7XYZ892",
            ocr_confidence=0.978,
            camera_id="CAM-ORR-204",
            detected_at=datetime.utcnow() - timedelta(minutes=1, seconds=15),
            vehicle_embedding=emb_clone_diff,
            vehicle_crop_path="car2_blue_suv.jpg",
            plate_crop_path="car2_blue_suv.jpg",
            color_guess="Silver SUV"
        )
        db.add(det_7xyz_b)
        db.commit()
        db.refresh(det_7xyz_b)

        anomaly_7xyz = Anomaly(
            plate_text="7XYZ892",
            detection_id_a=det_7xyz_a.id,
            detection_id_b=det_7xyz_b.id,
            implied_speed_kmh=560.0,
            embedding_similarity=0.4120,
            flagged_at=datetime.utcnow(),
            status="open"
        )
        db.add(anomaly_7xyz)

        db.commit()
        print("Demo seed complete! Added cameras, detections for KA01MJ5521 and 7XYZ892, and impossible clone anomalies.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_complete_demo_data()
