from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.session import get_db
from backend.app.schemas import NextCameraPrediction
from backend.app.services.predictor import get_predictor

router = APIRouter()

@router.get("/next-camera", response_model=List[NextCameraPrediction])
def predict_next_camera(
    plate: str = Query(..., description="Target vehicle registration plate"),
    db: Session = Depends(get_db)
):
    """
    Returns ranked probabilities of the vehicle's next camera junction
    based on the Markov corridor transition model.
    """
    clean_plate = plate.replace(" ", "").upper()
    predictor = get_predictor()
    predictions = predictor.predict_next_camera(clean_plate, db)
    return predictions
