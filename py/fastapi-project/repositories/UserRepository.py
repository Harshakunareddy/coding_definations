from models.user import User

class UserRepository:

    def get_by_id(self, db, user_id):
        return db.query(User).filter(
            User.id == user_id
        ).first()
    
    def get_by_email(self, db, email):
        return db.query(User).filter(
            User.email == email
        ).first()

    def get_all(self, db):
        return db.query(User).all()
    
    def create(self, db, user):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    def update(self, db, user_id, user):
        user = self.get_by_id(db, user_id)
        user.name = user.name
        user.email = user.email
        user.password = user.password
        db.commit()
        db.refresh(user)
        return user
    
    def delete(self, db, user_id):
        user = self.get_by_id(db, user_id)
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}

user_repository = UserRepository()