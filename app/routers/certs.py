from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import require_admin

router = APIRouter(prefix="/api/certs", tags=["certs"])

@router.get("", response_model=List[schemas.CertResponse])
def get_certs(admin: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Cert)
    if not admin:
        query = query.filter(models.Cert.show == True)
    return query.all()

@router.post("", response_model=schemas.CertResponse, status_code=status.HTTP_201_CREATED)
def create_cert(
    cert: schemas.CertCreate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_cert = models.Cert(**cert.model_dump())
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.put("/{cert_id}", response_model=schemas.CertResponse)
def update_cert(
    cert_id: int,
    cert_update: schemas.CertUpdate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_cert = db.query(models.Cert).filter(models.Cert.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certificate not found")

    for key, value in cert_update.model_dump(exclude_unset=True).items():
        setattr(db_cert, key, value)

    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.patch("/{cert_id}/toggle-show", response_model=schemas.CertResponse)
def toggle_cert_show(
    cert_id: int,
    payload: schemas.ToggleShow,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_cert = db.query(models.Cert).filter(models.Cert.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    db_cert.show = payload.show
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cert(
    cert_id: int,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_cert = db.query(models.Cert).filter(models.Cert.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(db_cert)
    db.commit()
    return None
