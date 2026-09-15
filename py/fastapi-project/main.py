from fastapi import FastAPI
from config.db import engine

from routers import users, users_repo_ser, view_router

app = FastAPI()

# Register all routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(users_repo_ser.router, prefix="/users", tags=["Users Repo"])
app.include_router(view_router.router, prefix="/views", tags=["Views"])

@app.get("/")
def home():
    return {
        "message": "Hellow Harsha"
    }


# So there are actually 3 free URLs you get
# URL	What it is
# /docs	Swagger UI — interactive, try it in browser
# /redoc	ReDoc UI — cleaner read-only docs
# /openapi.json	Raw JSON schema — the source of truth