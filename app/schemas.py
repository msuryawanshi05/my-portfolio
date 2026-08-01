from pydantic import BaseModel
from typing import List, Optional

# --- GENERIC TOGGLE ---
class ToggleShow(BaseModel):
    show: bool

# --- STAT TILES ---
class StatTileBase(BaseModel):
    label: str
    value: str
    icon_or_symbol: Optional[str] = ""
    link_url: Optional[str] = ""
    order: Optional[int] = 0
    show: Optional[bool] = True

class StatTileCreate(StatTileBase):
    pass

class StatTileUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    icon_or_symbol: Optional[str] = None
    link_url: Optional[str] = None
    order: Optional[int] = None
    show: Optional[bool] = None

class StatTileResponse(StatTileBase):
    id: int
    class Config:
        from_attributes = True

# --- PROJECTS ---
class ProjectBase(BaseModel):
    id: str
    name: Optional[str] = ""
    github: str
    live: Optional[str] = ""
    description: Optional[str] = ""
    language: Optional[str] = ""
    last_synced_at: Optional[str] = ""
    is_customized: Optional[bool] = False
    show: Optional[bool] = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    github: Optional[str] = None
    live: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    is_customized: Optional[bool] = True
    show: Optional[bool] = None

class ProjectResponse(ProjectBase):
    class Config:
        from_attributes = True

# --- CERTS ---
class CertBase(BaseModel):
    file: str
    label: str
    show: Optional[bool] = True

class CertCreate(CertBase):
    pass

class CertUpdate(BaseModel):
    file: Optional[str] = None
    label: Optional[str] = None
    show: Optional[bool] = None

class CertResponse(CertBase):
    id: int
    class Config:
        from_attributes = True

# --- SKILLS ---
class SkillBase(BaseModel):
    category: str  # 'security' or 'development'
    name: str
    show: Optional[bool] = True

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    show: Optional[bool] = None

class SkillResponse(SkillBase):
    id: int
    class Config:
        from_attributes = True

# --- RADAR ---
class RadarBase(BaseModel):
    label: str
    value: int

class RadarCreate(RadarBase):
    pass

class RadarResponse(RadarBase):
    id: int
    class Config:
        from_attributes = True

# --- EXPERIENCE ---
class ExperienceBase(BaseModel):
    title: str
    organization: str
    tag: Optional[str] = "INTERNSHIP"
    date_start: str
    date_end: Optional[str] = ""
    description: str
    order: Optional[int] = 0
    show: Optional[bool] = True

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    tag: Optional[str] = None
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    show: Optional[bool] = None

class ExperienceResponse(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

# --- FULL PORTFOLIO CONFIG AGGREGATOR RESPONSE ---
class FullSkillsResponse(BaseModel):
    security: List[str]
    development: List[str]
    radar: List[RadarBase]

class PortfolioConfigResponse(BaseModel):
    stats: dict
    leetcode: dict
    resume: dict
    projects: List[ProjectResponse]
    certs: List[CertResponse]
    skills: FullSkillsResponse
    experience: List[ExperienceResponse]
