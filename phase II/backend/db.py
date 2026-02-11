from sqlmodel import SQLModel, create_engine, Session

import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL, 
    echo=True, 
    pool_pre_ping=True,  
    pool_recycle=300    
)
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
