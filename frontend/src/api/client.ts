const API_BASE = import.meta.env.VITE_API_BASE ?? (
  typeof window !== "undefined" && window.location.hostname === "localhost" && window.location.port === "5173"
    ? "http://localhost:8000"
    : ""
);

export interface Camera {
  camera_id: string;
  name: string;
  lat: number;
  lon: number;
  road_segment?: string;
}

export interface Detection {
  id: number;
  plate_text: string;
  ocr_confidence: number;
  camera_id: string;
  camera_name: string;
  lat: number;
  lon: number;
  detected_at: string;
  vehicle_crop_url?: string;
  plate_crop_url?: string;
  color_guess?: string;
}

export interface DetectionSummary {
  id: number;
  plate_text: string;
  camera_id: string;
  camera_name?: string;
  lat?: number;
  lon?: number;
  detected_at: string;
  vehicle_crop_url?: string;
  color_guess?: string;
}

export interface Anomaly {
  id: number;
  plate_text: string;
  implied_speed_kmh: number;
  embedding_similarity: number;
  detection_a: DetectionSummary;
  detection_b: DetectionSummary;
  flagged_at: string;
  status: "open" | "acknowledged" | "false_positive";
}

export interface NextCameraPrediction {
  camera_id: string;
  camera_name: string;
  probability: number;
}

export interface DensityData {
  hours: number[];
  passenger: number[];
  freight: number[];
}

export interface ODLink {
  source: string;
  target: string;
  value: number;
}

export interface ODFlowData {
  nodes: string[];
  links: ODLink[];
}

export interface RouteSpeed {
  name: string;
  speeds_by_hour: number[];
  speed_limit: number;
}

export interface SpeedByRouteData {
  routes: RouteSpeed[];
}

export async function fetchCameras(): Promise<Camera[]> {
  const res = await fetch(`${API_BASE}/api/cameras`);
  if (!res.ok) throw new Error("Failed to fetch cameras");
  return res.json();
}

export async function fetchDetections(plate?: string): Promise<Detection[]> {
  const url = plate
    ? `${API_BASE}/api/detections?plate=${encodeURIComponent(plate)}`
    : `${API_BASE}/api/detections`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch detections");
  return res.json();
}

export async function fetchAnomalies(status?: string): Promise<Anomaly[]> {
  const url = status
    ? `${API_BASE}/api/anomalies?status=${encodeURIComponent(status)}`
    : `${API_BASE}/api/anomalies`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch anomalies");
  return res.json();
}

export async function acknowledgeAnomaly(
  anomalyId: number,
  status: "acknowledged" | "false_positive"
): Promise<{ id: number; status: string }> {
  const res = await fetch(`${API_BASE}/api/anomalies/${anomalyId}/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to acknowledge anomaly");
  return res.json();
}

export async function injectSyntheticClone(): Promise<Anomaly> {
  const res = await fetch(`${API_BASE}/api/anomalies/inject-synthetic-clone`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to inject clone");
  return res.json();
}

export async function predictNextCamera(plate: string): Promise<NextCameraPrediction[]> {
  const res = await fetch(
    `${API_BASE}/api/predict/next-camera?plate=${encodeURIComponent(plate)}`
  );
  if (!res.ok) throw new Error("Failed to predict next camera");
  return res.json();
}

export async function fetchDensity(window = "24h"): Promise<DensityData> {
  const res = await fetch(`${API_BASE}/api/analytics/density?window=${window}`);
  if (!res.ok) throw new Error("Failed to fetch traffic density");
  return res.json();
}

export async function fetchODFlow(): Promise<ODFlowData> {
  const res = await fetch(`${API_BASE}/api/analytics/od-flow`);
  if (!res.ok) throw new Error("Failed to fetch OD flow");
  return res.json();
}

export async function fetchSpeedByRoute(): Promise<SpeedByRouteData> {
  const res = await fetch(`${API_BASE}/api/analytics/speed-by-route`);
  if (!res.ok) throw new Error("Failed to fetch speed by route");
  return res.json();
}

export function getWebSocketAlertsUrl(): string {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" && window.location.port === "5173") {
      return "ws://localhost:8000/ws/alerts";
    }
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws/alerts`;
  }
  return "ws://localhost:8000/ws/alerts";
}

export function getCropUrl(relUrl?: string): string {
  if (!relUrl) return "";
  if (relUrl.startsWith("http")) return relUrl;
  return `${API_BASE}${relUrl}`;
}
