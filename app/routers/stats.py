from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import require_admin

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("", response_model=List[schemas.StatTileResponse])
def get_stat_tiles(admin: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.StatTile)
    if not admin:
        query = query.filter(models.StatTile.show == True)
    return query.order_by(models.StatTile.order.asc(), models.StatTile.id.asc()).all()

@router.post("", response_model=schemas.StatTileResponse, status_code=status.HTTP_201_CREATED)
def create_stat_tile(
    tile: schemas.StatTileCreate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_tile = models.StatTile(**tile.model_dump())
    db.add(db_tile)
    db.commit()
    db.refresh(db_tile)
    return db_tile

@router.put("/{tile_id}", response_model=schemas.StatTileResponse)
def update_stat_tile(
    tile_id: int,
    tile_update: schemas.StatTileUpdate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_tile = db.query(models.StatTile).filter(models.StatTile.id == tile_id).first()
    if not db_tile:
        raise HTTPException(status_code=404, detail="Stat tile not found")

    for key, value in tile_update.model_dump(exclude_unset=True).items():
        setattr(db_tile, key, value)

    db.commit()
    db.refresh(db_tile)
    return db_tile

@router.patch("/{tile_id}/toggle-show", response_model=schemas.StatTileResponse)
def toggle_stat_tile_show(
    tile_id: int,
    payload: schemas.ToggleShow,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_tile = db.query(models.StatTile).filter(models.StatTile.id == tile_id).first()
    if not db_tile:
        raise HTTPException(status_code=404, detail="Stat tile not found")
    
    db_tile.show = payload.show
    db.commit()
    db.refresh(db_tile)
    return db_tile

@router.delete("/{tile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stat_tile(
    tile_id: int,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_tile = db.query(models.StatTile).filter(models.StatTile.id == tile_id).first()
    if not db_tile:
        raise HTTPException(status_code=404, detail="Stat tile not found")
    db.delete(db_tile)
    db.commit()
    return None
