from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True) # e.g. 'log', 'ship', 'f1' or repo name
    name = Column(String, nullable=True, default="")
    github = Column(String, nullable=False, unique=True)
    live = Column(String, nullable=True, default="")
    description = Column(Text, nullable=True, default="")
    language = Column(String, nullable=True, default="")
    last_synced_at = Column(String, nullable=True, default="")
    is_customized = Column(Boolean, default=False)
    show = Column(Boolean, default=True)

class Cert(Base):
    __tablename__ = "certs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file = Column(String, nullable=False)
    label = Column(String, nullable=False)
    show = Column(Boolean, default=True)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String, nullable=False) # 'security' or 'development'
    name = Column(String, nullable=False)
    show = Column(Boolean, default=True)

class RadarEntry(Base):
    __tablename__ = "radar"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    label = Column(String, nullable=False)
    value = Column(Integer, nullable=False)

class StatTile(Base):
    __tablename__ = "stat_tiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    label = Column(String, nullable=False)
    value = Column(String, nullable=False)
    icon_or_symbol = Column(String, nullable=True, default="")
    link_url = Column(String, nullable=True, default="")
    order = Column(Integer, default=0)
    show = Column(Boolean, default=True)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    tag = Column(String, nullable=False, default="INTERNSHIP")
    date_start = Column(String, nullable=False)
    date_end = Column(String, nullable=True, default="")
    description = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    show = Column(Boolean, default=True)
