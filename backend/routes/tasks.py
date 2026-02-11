from fastapi import FastAPI, Depends, HTTPException
from typing import List
# Assuming you have your SQLModel setups ready
# Adding the prefix /api/{user_id} as per hackathon specs

app = FastAPI()

# 1. List all tasks for a specific user
@app.get("/api/{user_id}/tasks", response_model=List[Task])
async def list_tasks(user_id: str, current_user: User = Depends(get_current_user)):
    # Security Check: Ensure user can only see their own ID
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized access")
    # Fetch from DB logic here...
    return tasks

# 2. Create a new task
@app.post("/api/{user_id}/tasks", response_model=Task)
async def create_task(user_id: str, task: TaskCreate, current_user: User = Depends(get_current_user)):
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Save to DB logic here...
    return new_task

# 3. Toggle Completion (PATCH)
@app.patch("/api/{user_id}/tasks/{task_id}/complete")
async def toggle_task(user_id: str, task_id: int, current_user: User = Depends(get_current_user)):
    # Logic to find task and flip 'completed' status
    return {"message": "Task status updated"}

# 4. Delete Task
@app.delete("/api/{user_id}/tasks/{task_id}")
async def delete_task(user_id: str, task_id: int, current_user: User = Depends(get_current_user)):
    # Logic to delete task from DB
    return {"message": "Task deleted"}