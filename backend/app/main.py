import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.config import CROPS_DIR, BASE_DIR
from backend.app.db.session import SessionLocal, Base, engine
from backend.app.api.routes import trajectory, anomalies, prediction, analytics, alerts_ws
from backend.app.services.ingestion import populate_cameras

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Metro Sentinel / NexWatch ITS Platform",
    description="City-wide ANPR trajectory tracking, clone detection, and traffic analytics platform for SIH26127",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for vehicle and plate crops
os.makedirs(CROPS_DIR, exist_ok=True)
test_crops_dir = os.path.join(BASE_DIR, "data", "test_crops")
os.makedirs(test_crops_dir, exist_ok=True)

app.mount("/crops", StaticFiles(directory=CROPS_DIR), name="crops")
app.mount("/test_crops", StaticFiles(directory=test_crops_dir), name="test_crops")

from fastapi.responses import FileResponse, JSONResponse
from backend.app.models.detection import Detection
from backend.app.services.seed_demo_data import seed_complete_demo_data

# Include API routes
app.include_router(trajectory.router, prefix="/api", tags=["Trajectory & Cameras"])
app.include_router(anomalies.router, prefix="/api/anomalies", tags=["Anomalies & Clone Detection"])
app.include_router(prediction.router, prefix="/api/predict", tags=["Markov Predictive Engine"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Traffic Analytics"])
app.include_router(alerts_ws.router, tags=["WebSocket Alerts"])

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        populate_cameras(db)
        # If database has no detections yet (fresh cloud or container instance), seed initial dataset
        detection_count = db.query(Detection).count()
        if detection_count == 0:
            print("Fresh database detected — initializing demo cameras, detections, and clone alerts...")
            seed_complete_demo_data()
    except Exception as e:
        print(f"Startup database initialization notice: {e}")
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "NexWatch ANPR Intelligence Engine"}

# Static frontend SPA serving (for Docker / Render production)
frontend_dist = os.path.join(BASE_DIR, "frontend", "dist")
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("crops") or full_path.startswith("test_crops") or full_path.startswith("ws"):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        return JSONResponse(status_code=404, content={"detail": "Frontend build not found"})
