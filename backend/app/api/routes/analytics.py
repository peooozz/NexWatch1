from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.schemas import DensityResponse, ODFlowResponse, SpeedByRouteResponse, ODLink, RouteSpeed
from backend.app.models.detection import Detection
from backend.app.models.camera import Camera

router = APIRouter()

@router.get("/density", response_model=DensityResponse)
def get_traffic_density(
    window: str = Query("24h", description="Time window for traffic density"),
    db: Session = Depends(get_db)
):
    """
    Returns 24-hour city-wide traffic volume distribution split by passenger and freight vehicles.
    """
    hours = list(range(24))
    
    # Realistic 24-hour urban traffic flow curves (morning peak 9-11am, evening peak 5-8pm, freight late night)
    passenger = [
        120, 85, 45, 30, 60, 210, 580, 1140, 2480, 3120, 2850, 2410,
        2250, 2380, 2600, 2920, 3450, 3890, 3620, 2980, 2150, 1420, 890, 340
    ]
    freight = [
        480, 520, 490, 410, 320, 240, 190, 140, 180, 220, 260, 290,
        310, 340, 390, 450, 380, 310, 280, 340, 560, 710, 680, 590
    ]

    return DensityResponse(hours=hours, passenger=passenger, freight=freight)

@router.get("/od-flow", response_model=ODFlowResponse)
def get_od_flow(db: Session = Depends(get_db)):
    """
    Returns Origin-Destination flow matrix connecting urban key transit zones.
    """
    nodes = [
        "Silk Board Hub",
        "HSR Flyover",
        "Bellandur EcoSpace",
        "Marathahalli Bridge",
        "KR Puram Node",
        "Hebbal Expressway"
    ]

    links = [
        ODLink(source="Silk Board Hub", target="HSR Flyover", value=1420),
        ODLink(source="HSR Flyover", target="Bellandur EcoSpace", value=1850),
        ODLink(source="Bellandur EcoSpace", target="Marathahalli Bridge", value=2140),
        ODLink(source="Marathahalli Bridge", target="KR Puram Node", value=1690),
        ODLink(source="KR Puram Node", target="Hebbal Expressway", value=1280),
        ODLink(source="Silk Board Hub", target="Hebbal Expressway", value=840),
        ODLink(source="Bellandur EcoSpace", target="Hebbal Expressway", value=620)
    ]

    return ODFlowResponse(nodes=nodes, links=links)

@router.get("/speed-by-route", response_model=SpeedByRouteResponse)
def get_speed_by_route(db: Session = Depends(get_db)):
    """
    Returns average travel speeds across primary arterial corridors by hour.
    """
    routes = [
        RouteSpeed(
            name="Outer Ring Road (Silk Board - Marathahalli)",
            speed_limit=60.0,
            speeds_by_hour=[
                58.2, 59.0, 59.5, 60.0, 57.5, 48.2, 36.4, 24.1, 18.2, 21.0, 28.5, 32.1,
                30.4, 29.8, 31.2, 26.5, 19.8, 16.4, 17.9, 24.5, 36.8, 45.2, 52.1, 56.4
            ]
        ),
        RouteSpeed(
            name="Airport Expressway (Hebbal Interflow)",
            speed_limit=80.0,
            speeds_by_hour=[
                78.5, 79.2, 80.0, 80.0, 78.0, 72.1, 64.5, 52.8, 44.2, 49.0, 56.4, 61.2,
                58.9, 57.4, 59.1, 54.0, 46.2, 41.5, 43.8, 51.2, 62.4, 70.1, 74.8, 77.2
            ]
        ),
        RouteSpeed(
            name="Old Madras Road (KR Puram - Indiranagar)",
            speed_limit=50.0,
            speeds_by_hour=[
                48.1, 49.0, 49.5, 50.0, 47.0, 39.2, 28.4, 19.5, 14.8, 16.5, 22.0, 26.4,
                24.5, 23.8, 25.1, 21.4, 15.2, 13.1, 14.5, 19.8, 29.5, 38.4, 43.2, 46.8
            ]
        )
    ]

    return SpeedByRouteResponse(routes=routes)
