import json
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.session import SessionLocal
from backend.app.models.anomaly import Anomaly

def run_m4_m5_verification():
    client = TestClient(app)

    print("======================================================================")
    print("M4 TRAJECTORY API VERIFICATION")
    print("======================================================================")
    test_plate = "KA01AB1234"
    res = client.get(f"/api/detections?plate={test_plate}")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    detections = res.json()
    print(f"Queried GET /api/detections?plate={test_plate}")
    print(f"Total Sightings Found: {len(detections)}")

    # Verify chronological ordering
    times = [d["detected_at"] for d in detections]
    is_sorted = all(times[i] <= times[i+1] for i in range(len(times)-1))
    print(f"Chronological Sorting Ascending: {'PASS (100% Ordered)' if is_sorted else 'FAIL'}")

    print("\nChronological Corridor Trajectory:")
    for idx, d in enumerate(detections, 1):
        print(f"  Step {idx}: Camera {d['camera_id']} ({d['camera_name']})")
        print(f"          Coords: ({d['lat']:.4f}, {d['lon']:.4f}) | Time: {d['detected_at']}")
        print(f"          Confidence: {d['ocr_confidence']*100:.1f}% | Color: {d['color_guess']}")

    print("\n======================================================================")
    print("M5 CLONE / ANOMALY DETECTION & WEBSOCKET VERIFICATION")
    print("======================================================================")

    # Test WebSocket connection and message reception
    with client.websocket_connect("/ws/alerts") as websocket:
        init_msg = json.loads(websocket.receive_text())
        print(f"1. WebSocket Connected: {init_msg.get('message')}")

        # Inject synthetic impossible clone pair
        print("\n2. Injecting Synthetic Clone Detection Pair:")
        print("   - Detection A: White Sedan at Silk Board Junction (CAM-001)")
        print("   - Detection B: Red Commercial Truck at KR Puram Bridge (CAM-005) 2 mins later (18.2 km apart)")
        print("   - Implied Speed: ~546 km/h (> 120 km/h threshold)")
        print("   - Visual Embedding Similarity: ~0.055 (< 0.60 threshold)")

        inject_res = client.post("/api/anomalies/inject-synthetic-clone")
        assert inject_res.status_code == 200, f"Injection failed: {inject_res.text}"
        anomaly_data = inject_res.json()
        print(f"\n3. Anomaly Flagged in DB:")
        print(f"   Anomaly ID: {anomaly_data['id']}")
        print(f"   Plate: {anomaly_data['plate_text']}")
        print(f"   Implied Speed: {anomaly_data['implied_speed_kmh']} km/h")
        print(f"   Embedding Similarity: {anomaly_data['embedding_similarity']}")
        print(f"   Status: {anomaly_data['status']}")

        # Read live WebSocket broadcast
        ws_msg = json.loads(websocket.receive_text())
        print(f"\n4. WebSocket Alert Broadcast Received:")
        print(f"   Event Type: {ws_msg.get('type')}")
        payload = ws_msg.get('payload', {})
        print(f"   Broadcast Payload Anomaly ID: {payload.get('id')}")
        print(f"   Broadcast Implied Speed: {payload.get('implied_speed_kmh')} km/h")
        print(f"   Detection A: {payload.get('detection_a', {}).get('camera_name')} ({payload.get('detection_a', {}).get('color_guess')})")
        print(f"   Detection B: {payload.get('detection_b', {}).get('camera_name')} ({payload.get('detection_b', {}).get('color_guess')})")

        assert ws_msg.get('type') == 'new_anomaly', "Expected 'new_anomaly' event"
        assert payload.get('id') == anomaly_data['id'], "Mismatch in anomaly ID"
        print("\n5. WebSocket Verification Result: PASS - Live alert pushed instantly!")

    print("======================================================================")

if __name__ == "__main__":
    run_m4_m5_verification()
