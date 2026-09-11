from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="views")


@router.get("/users")
async def users_page(request: Request):

    users = [
        {
            "name": "Harsha",
            "email": "harsha@example.com"
        },
        {
            "name": "John",
            "email": "john@example.com"
        }
    ]

    return templates.TemplateResponse(
        "users.html",
        {
            "request": request,
            "users": users
        }
    )