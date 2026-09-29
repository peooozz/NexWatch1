import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def generate_video(
    video_path: str,
    cam_id: str,
    cam_name: str,
    vehicles: list,
    fps: int = 10,
    duration_sec: int = 6
):
    """
    Generates a realistic traffic camera video simulating vehicle transits.
    vehicles: list of dicts: {'plate': '...', 'color': (R,G,B), 'body': 'sedan'|'suv'|'truck', 'start_frame': int}
    """
    width, height = 960, 540
    total_frames = fps * duration_sec
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))

    # Base background (asphalt + lane markings)
    bg = np.full((height, width, 3), (110, 115, 120), dtype=np.uint8)
    cv2.rectangle(bg, (0, 150), (width, height), (48, 52, 56), -1)
    for lx in range(0, width, 100):
        cv2.rectangle(bg, (lx, 340), (lx + 50, 348), (215, 220, 225), -1)

    for f_idx in range(total_frames):
        frame = bg.copy()

        # Render active vehicles
        for v in vehicles:
            start_f = v['start_frame']
            # Vehicle active for ~25 frames
            rel_f = f_idx - start_f
            if 0 <= rel_f < 30:
                # Vehicle moves from left to right or top-left to bottom-right
                x = int(50 + rel_f * 28)
                y = int(240 + rel_f * 5)
                color = v.get('color', (220, 220, 220))
                b_color = (color[2], color[1], color[0]) # BGR
                body = v.get('body', 'sedan')
                plate = v.get('plate', 'KA01AB1234')

                vw, vh = 240, 120
                if body == 'truck':
                    vw, vh = 300, 150
                elif body == 'suv':
                    vw, vh = 260, 135

                # Body
                cv2.rectangle(frame, (x, y), (x + vw, y + vh), b_color, -1)
                cv2.rectangle(frame, (x, y), (x + vw, y + vh), (180, 180, 180), 2)

                # Windshield
                pts = np.array([
                    [x + 40, y + 40],
                    [x + 90, y + 10],
                    [x + vw - 40, y + 10],
                    [x + vw - 10, y + 40]
                ], np.int32)
                cv2.fillPoly(frame, [pts], (25, 35, 45))

                # Plate
                px1, py1 = x + int(vw * 0.25), y + int(vh * 0.70)
                px2, py2 = x + int(vw * 0.75), y + int(vh * 0.95)
                cv2.rectangle(frame, (px1, py1), (px2, py2), (250, 250, 250), -1)
                cv2.rectangle(frame, (px1, py1), (px2, py2), (30, 30, 30), 1)

                # Plate text
                pil_f = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                drw = ImageDraw.Draw(pil_f)
                drw.text((px1 + 8, py1 + 4), plate, fill=(10, 10, 10))
                frame = cv2.cvtColor(np.array(pil_f), cv2.COLOR_RGB2BGR)

        # Telemetry HUD
        time_sec = f_idx / fps
        cv2.rectangle(frame, (20, 15), (550, 50), (15, 20, 25), -1)
        hud_txt = f"{cam_id} [{cam_name.upper()}] | T+00:{time_sec:04.1f}s | LIVE"
        cv2.putText(frame, hud_txt, (30, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (230, 240, 255), 1)

        out.write(frame)

    out.release()
    print(f"Generated {video_path} ({total_frames} frames)")

def generate_all_sample_videos():
    os.makedirs("data/camera_videos", exist_ok=True)

    cameras_data = [
        ("CAM-001", "Silk Board N", [
            {'plate': 'KA01AB1234', 'color': (240, 240, 245), 'body': 'sedan', 'start_frame': 5},
            {'plate': 'KA05MH8821', 'color': (25, 25, 30), 'body': 'sedan', 'start_frame': 32}
        ]),
        ("CAM-002", "HSR Layout Entry", [
            {'plate': 'KA01AB1234', 'color': (240, 240, 245), 'body': 'sedan', 'start_frame': 8},
            {'plate': 'KA03MG4412', 'color': (160, 170, 180), 'body': 'suv', 'start_frame': 28}
        ]),
        ("CAM-003", "Bellandur EcoSpace", [
            {'plate': 'KA01AB1234', 'color': (240, 240, 245), 'body': 'sedan', 'start_frame': 4},
            {'plate': 'KA03MG4412', 'color': (160, 170, 180), 'body': 'suv', 'start_frame': 30}
        ]),
        ("CAM-004", "Marathahalli Bridge", [
            {'plate': 'KA01AB1234', 'color': (240, 240, 245), 'body': 'sedan', 'start_frame': 6},
            {'plate': 'KA53TR7710', 'color': (180, 40, 45), 'body': 'truck', 'start_frame': 26}
        ]),
        ("CAM-005", "KR Puram Bridge", [
            {'plate': 'KA53TR7710', 'color': (180, 40, 45), 'body': 'truck', 'start_frame': 10},
            {'plate': 'KA02CD5566', 'color': (235, 180, 20), 'body': 'sedan', 'start_frame': 32}
        ]),
        ("CAM-006", "Hebbal Flyover", [
            {'plate': 'KA04EQ9901', 'color': (30, 70, 160), 'body': 'sedan', 'start_frame': 12},
            {'plate': 'KA02CD5566', 'color': (235, 180, 20), 'body': 'sedan', 'start_frame': 35}
        ])
    ]

    for cid, cname, vehs in cameras_data:
        vpath = f"data/camera_videos/{cid.lower().replace('-', '_')}.mp4"
        generate_video(vpath, cid, cname, vehs)

if __name__ == "__main__":
    generate_all_sample_videos()
