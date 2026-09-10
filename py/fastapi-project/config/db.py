from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

url = "postgresql+psycopg2://username:password@localhost:5432/database_name"

engine = create_engine(url)
Base = declarative_base()