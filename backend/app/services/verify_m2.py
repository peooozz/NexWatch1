import numpy as np
import cv2
import os
from backend.app.services.fingerprint import get_fingerprinter
from PIL import Image, ImageDraw

def create_synthetic_vehicle_image(color=(220, 220, 220), body_type="sedan", variation=0):
    """Generates a realistic synthetic vehicle crop with distinctive features for verification."""
    img = Image.new("RGB", (320, 240), (80, 85, 90))
    draw = ImageDraw.Draw(img)

    # Road surface
    draw.rectangle([0, 180, 320, 240], fill=(45, 50, 55))

    # Vehicle body
    shift_x = variation * 4
    shift_y = variation * 2

    if body_type == "sedan":
        # White / Silver Sedan
        draw.rounded_rectangle([40 + shift_x, 80 + shift_y, 280 + shift_x, 190 + shift_y], radius=16, fill=color)
        # Windshield & Windows
        draw.polygon([(80 + shift_x, 90 + shift_y), (130 + shift_x, 50 + shift_y), (220 + shift_x, 50 + shift_y), (250 + shift_x, 90 + shift_y)], fill=(30, 45, 60))
        # Headlights / Taillights
        draw.rectangle([50 + shift_x, 110 + shift_y, 70 + shift_x, 130 + shift_y], fill=(255, 240, 200))
        draw.rectangle([250 + shift_x, 110 + shift_y, 270 + shift_x, 130 + shift_y], fill=(255, 240, 200))
        # License plate on bumper
        draw.rectangle([110 + shift_x, 150 + shift_y, 210 + shift_x, 175 + shift_y], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    elif body_type == "suv":
        # Dark Blue / Black SUV
        draw.rounded_rectangle([30 + shift_x, 50 + shift_y, 290 + shift_x, 195 + shift_y], radius=8, fill=color)
        draw.polygon([(60 + shift_x, 60 + shift_y), (100 + shift_x, 25 + shift_y), (240 + shift_x, 25 + shift_y), (270 + shift_x, 60 + shift_y)], fill=(20, 25, 30))
        # Fog lamps & grill
        draw.rectangle([80 + shift_x, 130 + shift_y, 240 + shift_x, 150 + shift_y], fill=(20, 20, 20))
        # License plate
        draw.rectangle([115 + shift_x, 160 + shift_y, 205 + shift_x, 185 + shift_y], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    elif body_type == "truck":
        # Red Commercial Freight Truck
        draw.rectangle([20 + shift_x, 30 + shift_y, 300 + shift_x, 195 + shift_y], fill=color)
        draw.rectangle([40 + shift_x, 40 + shift_y, 280 + shift_x, 90 + shift_y], fill=(15, 20, 30))
        draw.rectangle([100 + shift_x, 165 + shift_y, 220 + shift_x, 190 + shift_y], fill=(255, 255, 200), outline=(0, 0, 0), width=2)

    # Wheels
    draw.ellipse([50 + shift_x, 170 + shift_y, 90 + shift_x, 210 + shift_y], fill=(10, 10, 10))
    draw.ellipse([230 + shift_x, 170 + shift_y, 270 + shift_x, 210 + shift_y], fill=(10, 10, 10))

    return img

def run_m2_verification():
    os.makedirs("data/test_crops", exist_ok=True)
    fp = get_fingerprinter()

    # Generate 2 crops of the same physical white sedan (camera A vs camera B with slight motion/crop shift)
    car1_cropA = create_synthetic_vehicle_image(color=(235, 238, 240), body_type="sedan", variation=0)
    car1_cropB = create_synthetic_vehicle_image(color=(230, 235, 238), body_type="sedan", variation=2)

    # Generate 1 crop of a different vehicle (Blue SUV)
    car2_crop = create_synthetic_vehicle_image(color=(20, 45, 95), body_type="suv", variation=0)

    # Generate 1 crop of another different vehicle (Red Freight Truck)
    car3_crop = create_synthetic_vehicle_image(color=(185, 30, 35), body_type="truck", variation=0)

    # Save to disk
    car1_cropA.save("data/test_crops/car1_white_sedan_cropA.jpg")
    car1_cropB.save("data/test_crops/car1_white_sedan_cropB.jpg")
    car2_crop.save("data/test_crops/car2_blue_suv.jpg")
    car3_crop.save("data/test_crops/car3_red_truck.jpg")

    # Extract 512-dim ResNet18 embeddings
    emb_car1_A = fp.extract_embedding(car1_cropA)
    emb_car1_B = fp.extract_embedding(car1_cropB)
    emb_car2 = fp.extract_embedding(car2_crop)
    emb_car3 = fp.extract_embedding(car3_crop)

    # Compute Cosine Similarities
    sim_same_vehicle = fp.cosine_similarity(emb_car1_A, emb_car1_B)
    sim_sedan_vs_suv = fp.cosine_similarity(emb_car1_A, emb_car2)
    sim_sedan_vs_truck = fp.cosine_similarity(emb_car1_A, emb_car3)
    sim_suv_vs_truck = fp.cosine_similarity(emb_car2, emb_car3)

    print("======================================================================")
    print("M2 VEHICLE FINGERPRINTING VERIFICATION RESULTS")
    print("======================================================================")
    print(f"Embedding dimension: {len(emb_car1_A)} (ResNet18 penultimate layer)")
    print(f"Embedding L2 norm check: {np.linalg.norm(emb_car1_A):.4f}")
    print("----------------------------------------------------------------------")
    print(f"1. Same Vehicle (White Sedan Crop A vs Crop B):")
    print(f"   Cosine Similarity = {sim_same_vehicle:.4f}  (Requirement: > 0.80)")
    print(f"   Status: {'PASS' if sim_same_vehicle >= 0.80 else 'FAIL'}")
    print("----------------------------------------------------------------------")
    print(f"2. Different Vehicles (White Sedan vs Blue SUV):")
    print(f"   Cosine Similarity = {sim_sedan_vs_suv:.4f}  (Requirement: < 0.60)")
    print(f"   Status: {'PASS' if sim_sedan_vs_suv < 0.60 else 'FAIL'}")
    print("----------------------------------------------------------------------")
    print(f"3. Different Vehicles (White Sedan vs Red Truck):")
    print(f"   Cosine Similarity = {sim_sedan_vs_truck:.4f}  (Requirement: < 0.60)")
    print(f"   Status: {'PASS' if sim_sedan_vs_truck < 0.60 else 'FAIL'}")
    print("----------------------------------------------------------------------")
    print(f"4. Different Vehicles (Blue SUV vs Red Truck):")
    print(f"   Cosine Similarity = {sim_suv_vs_truck:.4f}  (Requirement: < 0.60)")
    print(f"   Status: {'PASS' if sim_suv_vs_truck < 0.60 else 'FAIL'}")
    print("======================================================================")

if __name__ == "__main__":
    run_m2_verification()
