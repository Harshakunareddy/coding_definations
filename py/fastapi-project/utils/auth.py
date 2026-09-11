from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = 'your-secret-key'
ALGORITHM = 'HS256'

def bearer_token(user_id: int) -> str:
    expires = datetime.now() + timedelta(hours=24)
    to_encode = {"exp": expires, "sub": str(user_id)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return {"error": "Invalid token"}
