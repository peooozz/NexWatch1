from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any, Optional
import json
import logging
import asyncio

router = APIRouter()
logger = logging.getLogger("alerts_ws")

class AlertConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.loop: Optional[asyncio.AbstractEventLoop] = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        try:
            self.loop = asyncio.get_running_loop()
        except RuntimeError:
            pass
        logger.info(f"WebSocket client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Total active: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to WebSocket: {e}")
                disconnected.append(connection)
        for d in disconnected:
            self.disconnect(d)

manager = AlertConnectionManager()

def broadcast_new_anomaly_sync(payload: Dict[str, Any]):
    """Synchronous helper for worker threads / tasks to broadcast new anomalies."""
    try:
        if manager.loop and manager.loop.is_running():
            asyncio.run_coroutine_threadsafe(manager.broadcast(payload), manager.loop)
        else:
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    asyncio.create_task(manager.broadcast(payload))
                else:
                    loop.run_until_complete(manager.broadcast(payload))
            except RuntimeError:
                pass
    except Exception as e:
        logger.error(f"Failed to broadcast anomaly synchronously: {e}")

@router.websocket("/ws/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial confirmation ping
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Connected to Metro Sentinel Live Alert Stream"
        }))
        while True:
            # Keep connection open; receive client heartbeats or messages
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
