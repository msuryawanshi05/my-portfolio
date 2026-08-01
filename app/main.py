import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.database import get_db, engine, Base
from app import models, schemas
from app.routers import projects, certs, skills, stats, experience

load_dotenv()

# Ensure database tables exist automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mukul Suryawanshi Portfolio API",
    description="Security-first portfolio API with Clerk authentication, single-admin CRUD management, and GitHub sync.",
    version="2.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(stats.router)
app.include_router(projects.router)
app.include_router(certs.router)
app.include_router(skills.router)
app.include_router(experience.router)

@app.get("/api/config", response_model=schemas.PortfolioConfigResponse)
def get_full_portfolio_config(db: Session = Depends(get_db)):
    """
    Returns public portfolio configuration matching PORTFOLIO_CONFIG schema in config.js.
    CRITICAL SECURITY & PRIVACY RULE: Only returns items where show == True. Hidden items NEVER leak here.
    """
    db_stat_tiles = stats.get_stat_tiles(admin=False, db=db)
    db_projects = projects.get_projects(admin=False, db=db)
    db_certs = certs.get_certs(admin=False, db=db)
    db_skills = skills.get_skills(admin=False, db=db)
    db_experience = experience.get_experiences(admin=False, db=db)

    # Convert StatTiles to legacy stats dictionary for backwards compatibility
    stats_dict = {
        "ctf_rank": "#3",
        "machines": 22,
        "certifications": 4,
        "leetcode_solved": 10,
        "leetcode_url": "https://leetcode.com/u/msuryawanshi05/",
        "resume_file": "assets/Mukul_Resume.pdf"
    }

    # If any specific stat tile matches, override
    for tile in db_stat_tiles:
        if "ctf" in tile.label.lower():
            stats_dict["ctf_rank"] = tile.value
        elif "machines" in tile.label.lower():
            try:
                stats_dict["machines"] = int(tile.value.replace("+", "").strip())
            except ValueError:
                pass
        elif "leetcode" in tile.label.lower():
            try:
                stats_dict["leetcode_solved"] = int(tile.value.replace("+", "").strip())
            except ValueError:
                pass
            if tile.link_url:
                stats_dict["leetcode_url"] = tile.link_url
        elif "cert" in tile.label.lower():
            try:
                stats_dict["certifications"] = int(tile.value.replace("+", "").strip())
            except ValueError:
                pass

    return schemas.PortfolioConfigResponse(
        stats=stats_dict,
        leetcode={
            "profileUrl": stats_dict["leetcode_url"]
        },
        resume={
            "file": stats_dict["resume_file"]
        },
        projects=[schemas.ProjectResponse.model_validate(p) for p in db_projects],
        certs=[schemas.CertResponse.model_validate(c) for c in db_certs],
        skills=db_skills,
        experience=[schemas.ExperienceResponse.model_validate(e) for e in db_experience]
    )

# Mount root directory to serve HTML/CSS/JS assets
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.mount("/", StaticFiles(directory=current_dir, html=True), name="static")
