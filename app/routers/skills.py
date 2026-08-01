from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import require_admin

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("", response_model=schemas.FullSkillsResponse)
def get_skills(admin: bool = False, db: Session = Depends(get_db)):
    sec_query = db.query(models.Skill).filter(models.Skill.category == "security")
    dev_query = db.query(models.Skill).filter(models.Skill.category == "development")

    if not admin:
        sec_query = sec_query.filter(models.Skill.show == True)
        dev_query = dev_query.filter(models.Skill.show == True)

    radar_entries = db.query(models.RadarEntry).all()

    return schemas.FullSkillsResponse(
        security=[s.name for s in sec_query.all()],
        development=[s.name for s in dev_query.all()],
        radar=[schemas.RadarBase(label=r.label, value=r.value) for r in radar_entries]
    )

@router.get("/list", response_model=List[schemas.SkillResponse])
def get_skills_list(admin: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Skill)
    if not admin:
        query = query.filter(models.Skill.show == True)
    return query.all()

@router.post("", response_model=schemas.SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.patch("/{skill_id}/toggle-show", response_model=schemas.SkillResponse)
def toggle_skill_show(
    skill_id: int,
    payload: schemas.ToggleShow,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db_skill.show = payload.show
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return None

# --- RADAR ENDPOINTS ---
@router.put("/radar", response_model=List[schemas.RadarResponse])
def update_radar(
    radar_items: List[schemas.RadarBase],
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db.query(models.RadarEntry).delete()
    new_entries = []
    for item in radar_items:
        entry = models.RadarEntry(label=item.label, value=item.value)
        db.add(entry)
        new_entries.append(entry)
    db.commit()
    for e in new_entries:
        db.refresh(e)
    return new_entries
