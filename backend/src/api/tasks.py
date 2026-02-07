"""
Task management API endpoints.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime

from ..auth.dependencies import get_current_user
from ..core.database import get_session
from ..models.task import Task, TaskCreate, TaskUpdate, TaskResponse

# Create router with prefix and tags
router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Create a new task for authenticated user."""
    # Create task with user_id from JWT
    task = Task(
        user_id=UUID(user_id),
        title=task_data.title,
        description=task_data.description
    )

    # Persist to database
    session.add(task)
    session.commit()
    session.refresh(task)

    # Return created task
    return task


@router.get("/", response_model=list[TaskResponse], status_code=status.HTTP_200_OK)
async def list_tasks(
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """List all tasks for authenticated user, ordered by creation date (newest first)."""
    # Query tasks filtered by user_id and ordered by created_at DESC
    statement = select(Task).where(Task.user_id == UUID(user_id)).order_by(Task.created_at.desc())
    tasks = session.exec(statement).all()

    # Return list of tasks
    return tasks


@router.get("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def get_task(
    task_id: UUID,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Get a specific task by ID."""
    # Query task by ID
    task = session.get(Task, task_id)

    # Check existence (404 before 403 to prevent info leakage)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check ownership
    if str(task.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Return task
    return task


@router.put("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Update an existing task's title and/or description."""
    # Query task by ID
    task = session.get(Task, task_id)

    # Check existence (404 before 403 to prevent info leakage)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check ownership
    if str(task.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Update task fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description

    # Update timestamp
    task.updated_at = datetime.utcnow()

    # Persist changes
    session.add(task)
    session.commit()
    session.refresh(task)

    # Return updated task
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Delete a task permanently."""
    # Query task by ID
    task = session.get(Task, task_id)

    # Check existence (404 before 403 to prevent info leakage)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check ownership
    if str(task.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Delete task
    session.delete(task)
    session.commit()

    # Return 204 No Content (no return statement needed)


@router.patch("/{task_id}/complete", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def toggle_task_completion(
    task_id: UUID,
    user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """Toggle task completion status (complete <-> incomplete)."""
    # Query task by ID
    task = session.get(Task, task_id)

    # Check existence (404 before 403 to prevent info leakage)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check ownership
    if str(task.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Toggle completion status
    if not task.completed:
        # Mark as complete
        task.completed = True
        task.completed_at = datetime.utcnow()
    else:
        # Mark as incomplete
        task.completed = False
        task.completed_at = None

    # Update timestamp
    task.updated_at = datetime.utcnow()

    # Persist changes
    session.add(task)
    session.commit()
    session.refresh(task)

    # Return updated task
    return task
