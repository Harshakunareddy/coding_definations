from fastapi import FastAPI
from config.db import engine


app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Hellow Harsha"
    }