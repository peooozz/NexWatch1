from backend.app.db.session import SessionLocal
from backend.app.services.predictor import get_predictor
from backend.app.models.detection import Detection

def run_m6_verification():
    db = SessionLocal()
    try:
        predictor = get_predictor()
        debug_matrix = predictor.get_debug_matrix(db)

        print("======================================================================")
        print("M6 MARKOV CORRIDOR PREDICTOR & NEXT-SIGHTING ENGINE VERIFICATION")
        print("======================================================================")
        print("\n1. RAW CORRIDOR TRANSITION COUNTS MATRIX:")
        print(f"{'From Camera':<12} | {'To Camera':<12} | Transitions")
        print("----------------------------------------------------------------------")
        for from_cam, targets in debug_matrix["counts"].items():
            for to_cam, count in targets.items():
                print(f"{from_cam:<12} -> {to_cam:<12} | {count}")

        print("\n2. CONDITIONAL PROBABILITY DISTRIBUTION P(Next | Current):")
        print(f"{'From Camera':<12} | {'To Camera':<12} | Probability")
        print("----------------------------------------------------------------------")
        for from_cam, targets in debug_matrix["probabilities"].items():
            for to_cam, prob in targets.items():
                print(f"{from_cam:<12} -> {to_cam:<12} | {prob * 100:>6.2f}%")

        # Test plate KA01AB1234
        test_plate = "KA01AB1234"
        print(f"\n3. PREDICTING NEXT-CAMERA SIGHTING FOR VEHICLE: {test_plate}")
        last_det = db.query(Detection).filter(Detection.plate_text == test_plate).order_by(Detection.detected_at.desc()).first()
        print(f"   Last Sighting: {last_det.camera_id} at {last_det.detected_at}")

        predictions = predictor.predict_next_camera(test_plate, db)
        print(f"   Ranked Next Likely Junctions:")
        for rank, p in enumerate(predictions, 1):
            print(f"   #{rank}: {p['camera_id']} ({p['camera_name']}) - Probability: {p['probability'] * 100:.2f}%")

        print("======================================================================")
    finally:
        db.close()

if __name__ == "__main__":
    run_m6_verification()
