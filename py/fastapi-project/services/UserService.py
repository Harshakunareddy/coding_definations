from fastapi import HTTPException

from repositories.UserRepository import user_repository as repo
from utils.password import verify_password
from utils.auth import bearer_token, decode_token

class UserService:

    def get_user(self, db, user_id):
        user = repo.get_by_id(db, user_id)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user

    def get_all_users(self, db):
        return repo.get_all(db)

    def create_user(self, db, user):
        return repo.create(db, user)

    def update_user(self, db, user_id, user):
        return repo.update(db, user_id, user)

    def delete_user(self, db, user_id):
        return repo.delete(db, user_id)

    def login_user(self, db, email, password):
        user = repo.get_by_email(db, email)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=401,
                detail="Invalid password"
            )
        return user
    
    def get_token(self, db, user_id):
        token = bearer_token(user_id)
        return token
    
    def decode_token(self, db, token):
        payload = decode_token(token)
        return payload
    
user_service = UserService()