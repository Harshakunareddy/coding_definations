from enum import Enum
from sqlalchemy import Column, Integer, String
from config.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(50))
    status=Column(Enum("active","inactive"), default="active")
    is_superuser=Column(Boolean, default=False)
    college_id = Column(Integer, ForiegnKey("colleges.id"))

class College(Base):
    __tablename__ = "colleges"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    address = Column(String(50))
    
    
    