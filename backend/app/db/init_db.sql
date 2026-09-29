-- Schema for PostgreSQL + PostGIS (Production)
CREATE TABLE IF NOT EXISTS cameras (
  camera_id     VARCHAR PRIMARY KEY,
  name          VARCHAR NOT NULL,
  lat           DOUBLE PRECISION NOT NULL,
  lon           DOUBLE PRECISION NOT NULL,
  road_segment  VARCHAR
);

CREATE TABLE IF NOT EXISTS detections (
  id                SERIAL PRIMARY KEY,
  plate_text        VARCHAR NOT NULL,
  ocr_confidence    FLOAT NOT NULL,
  camera_id         VARCHAR REFERENCES cameras(camera_id),
  detected_at       TIMESTAMP NOT NULL,
  vehicle_embedding FLOAT8[],          -- 512 or 1280-dim ResNet18 embedding
  vehicle_crop_path VARCHAR,
  plate_crop_path   VARCHAR,
  color_guess       VARCHAR
);
CREATE INDEX IF NOT EXISTS idx_detections_plate ON detections(plate_text);
CREATE INDEX IF NOT EXISTS idx_detections_time ON detections(detected_at);

CREATE TABLE IF NOT EXISTS anomalies (
  id                    SERIAL PRIMARY KEY,
  plate_text            VARCHAR NOT NULL,
  detection_id_a        INT REFERENCES detections(id),
  detection_id_b        INT REFERENCES detections(id),
  implied_speed_kmh     FLOAT NOT NULL,
  embedding_similarity  FLOAT NOT NULL,
  flagged_at            TIMESTAMP NOT NULL,
  status                VARCHAR DEFAULT 'open'  -- open | acknowledged | false_positive
);

CREATE TABLE IF NOT EXISTS blacklist (
  plate_text  VARCHAR PRIMARY KEY,
  reason      VARCHAR,
  added_at    TIMESTAMP DEFAULT now()
);
