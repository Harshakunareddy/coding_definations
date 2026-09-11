from typing import Hashable
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.password import hash_password, verify_password
from utils.auth import bearer_token, decode_token


from config.db import SessionLocal
from models.user import User

router = APIRouter(prefix='/users', tags=['Users'])

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.get('/all')
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get('/{user_id}')
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

# @router.post('/')
# def create_user(user: User, db: Session = Depends(get_db)):
#     db.add(user)
#     db.commit()
#     db.refresh(user)
#     return user

@router.post('/')
async def create_user_post(
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail='User already exists')
    new_user = User(
        name = name,
        email = email,
        password = hash_password(password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}")
async def update_user(
    user_id: int,
    name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    user.name = name
    user.email = email
    user.password = hash_password(password)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}



@router.post("/login")
async def login_user(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail='Invalid email')
    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail='Invalid password')
    
    token = bearer_token(user.id)
    return {
        "message": "Login successful",
        "user": user,
        "token": token
    }

@router.get("/me")
async def me(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if payload.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload