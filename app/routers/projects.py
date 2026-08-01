import os
import httpx
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import require_admin

router = APIRouter(prefix="/api/projects", tags=["projects"])

GITHUB_USERNAME = "msuryawanshi05"

@router.get("", response_model=List[schemas.ProjectResponse])
def get_projects(admin: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if not admin:
        query = query.filter(models.Project.show == True)
    return query.all()

@router.post("/sync", response_model=List[schemas.ProjectResponse])
def sync_github_repos(
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    """
    Syncs public repositories from GitHub API.
    Unauthenticated request by default (no PAT needed for public listing).
    Note: If rate limits occur (60 req/hr), add GITHUB_PAT to .env and it will be sent in Authorization header.
    """
    url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100&sort=updated"
    headers = {"User-Agent": "FastAPI-Portfolio-App"}
    
    pat = os.getenv("GITHUB_PAT")
    if pat:
        headers["Authorization"] = f"token {pat}"

    try:
        response = httpx.get(url, headers=headers, timeout=15.0)
        response.raise_for_status()
        repos = response.json()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to fetch repositories from GitHub API: {str(e)}"
        )

    synced_at = datetime.now(timezone.utc).isoformat()
    processed = []

    for repo in repos:
        repo_name = repo.get("name", "")
        html_url = repo.get("html_url", "")
        description = repo.get("description") or ""
        language = repo.get("language") or ""
        
        # Match by github URL or repo name/id
        existing = db.query(models.Project).filter(
            (models.Project.github == html_url) | (models.Project.id == repo_name)
        ).first()

        # Exclude AidChain (not user's project — keep show=False)
        is_aidchain = "aidchain" in repo_name.lower() or "aidchain" in html_url.lower()

        if not existing:
            # Insert new repo row with show=False by default
            new_project = models.Project(
                id=repo_name,
                name=repo_name,
                github=html_url,
                live="",
                description=description,
                language=language,
                last_synced_at=synced_at,
                is_customized=False,
                show=False  # Hidden by default until explicitly toggled on by admin
            )
            db.add(new_project)
            processed.append(new_project)
        else:
            if is_aidchain:
                existing.show = False
            existing.last_synced_at = synced_at
            if not existing.is_customized:
                existing.name = repo_name
                existing.description = description
                existing.language = language
            processed.append(existing)

    db.commit()
    for p in processed:
        db.refresh(p)
    return processed

@router.post("", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    existing = db.query(models.Project).filter(models.Project.id == project.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with ID '{project.id}' already exists."
        )
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: str,
    project_update: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_update.model_dump(exclude_unset=True)
    # Manual edit sets is_customized = True
    update_data["is_customized"] = True

    for key, value in update_data.items():
        setattr(db_project, key, value)

    db.commit()
    db.refresh(db_project)
    return db_project

@router.patch("/{project_id}/toggle-show", response_model=schemas.ProjectResponse)
def toggle_project_show(
    project_id: str,
    payload: schemas.ToggleShow,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.show = payload.show
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(require_admin)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return None
