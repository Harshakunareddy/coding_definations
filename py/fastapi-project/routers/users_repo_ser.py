from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.db import SessionLocal
from services.UserService import user_service as service

router = APIRouter(prefix='/users-repo-ser', tags=['Users'])

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.get('/all')
async def get_all_users(db: Session = Depends(get_db)):
    return service.get_all_users(db)

@router.get('/{user_id}')
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return service.get_user(db, user_id)

@router.post('/')
async def create_user_post(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    return service.create_user(db, name, email, password)

@router.put("/{user_id}")
async def update_user(
    user_id: int,
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    return service.update_user(db, user_id, name, email, password)

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_user(db, user_id)

@router.post("/login")
async def login_user(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    return service.login_user(db, email, password)

@router.get("/me")
async def me(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return service.decode_token(db, token)


@router.post('/token')
async def token(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = service.login_user(db, email, password)
    token = service.get_token(db, user.id)
    return {
        "message": "Token generated successfully",
        "token": token
    }