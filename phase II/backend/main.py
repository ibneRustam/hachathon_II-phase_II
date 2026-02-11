import os
from fastapi import FastAPI, Depends, HTTPException
from typing import List, Optional
from sqlmodel import SQLModel, Field, Session, select, create_engine
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# .env file se data load karne ke liye
load_dotenv()

# Database Setup - Online (PostgreSQL) ya Local (SQLite)
DATABASE_URL = os.getenv("DATABASE_URL")

# Agar DATABASE_URL na mile to local database ban jaye (sirf testing ke liye)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///database.db"

# PostgreSQL ke liye sslmode zaroori hota hai online platforms par
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(DATABASE_URL, echo=True)
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = False
    is_important: bool = False
    user_id: int 

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    password: str

class AuthData(SQLModel):
    email: str
    password: str

# Database initialization
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI()

# CORS FIX: Isse Vercel aur Render ke darmiyan masla nahi hoga
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Server is running perfectly!"}

@app.post("/auth/signup")
async def signup(data: AuthData, session: Session = Depends(get_session)):
    try:
        user = User(email=data.email, password=data.password)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"access_token": f"token_{user.id}", "user_id": user.id}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="User already exists or DB error")

@app.post("/auth/login")
async def login(data: AuthData, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email, User.password == data.password)).first()
    if not user: raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": f"token_{user.id}", "user_id": user.id}

@app.get("/api/{user_id}/tasks")
async def list_tasks(user_id: int, session: Session = Depends(get_session)):
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.is_important.desc())
    return session.exec(statement).all()

@app.post("/api/{user_id}/tasks")
async def create_task(user_id: int, task_data: dict, session: Session = Depends(get_session)):
    new_task = Task(
        title=task_data.get("title"),
        description=task_data.get("description"),
        is_important=task_data.get("is_important", False),
        completed=False,
        user_id=user_id
    )
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task

@app.patch("/api/{user_id}/tasks/{task_id}/complete")
async def toggle_complete(user_id: int, task_id: int, session: Session = Depends(get_session)):
    task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == user_id)).first()
    if not task: raise HTTPException(status_code=404)
    task.completed = not task.completed
    session.add(task)
    session.commit()
    return task

@app.patch("/api/{user_id}/tasks/{task_id}/update")
async def update_task(user_id: int, task_id: int, task_data: dict, session: Session = Depends(get_session)):
    db_task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == user_id)).first()
    if not db_task: raise HTTPException(status_code=404)
    db_task.title = task_data.get("title", db_task.title)
    db_task.description = task_data.get("description", db_task.description)
    db_task.is_important = task_data.get("is_important", db_task.is_important)
    session.add(db_task)
    session.commit()
    return db_task

@app.delete("/api/{user_id}/tasks/{task_id}")
async def delete_task(user_id: int, task_id: int, session: Session = Depends(get_session)):
    task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == user_id)).first()
    if not task: raise HTTPException(status_code=404)
    session.delete(task)
    session.commit()
    return {"message": "Deleted"}