from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from app.auth import require_admin

router = APIRouter(prefix="/api/experience", tags=["experience"])

@router.get("", response_model=List[schemas.ExperienceResponse])
def get_experiences(admin: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Experience)
    if not admin:
        query = query.filter(models.Experience.show == True)
    return query.order_by(models.Experience.order.asc(), models.Experience.id.asc()).all()

@router.post("", response_model=schemas.ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp: schemas.ExperienceCreate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_exp = models.Experience(**exp.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.put("/{exp_id}", response_model=schemas.ExperienceResponse)
def update_experience(
    exp_id: int,
    exp_update: schemas.ExperienceUpdate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience entry not found")

    for key, value in exp_update.model_dump(exclude_unset=True).items():
        setattr(db_exp, key, value)

    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.patch("/{exp_id}/toggle-show", response_model=schemas.ExperienceResponse)
def toggle_experience_show(
    exp_id: int,
    payload: schemas.ToggleShow,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience entry not found")
    
    db_exp.show = payload.show
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience entry not found")
    db.delete(db_exp)
    db.commit()
    return None
