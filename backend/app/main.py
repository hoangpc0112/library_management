from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import books, users, auth, borrow_request, recommendation
from fastapi.staticfiles import StaticFiles

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/images", StaticFiles(directory="app/assets/"), name="images")
app.include_router(books.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(borrow_request.router)
app.include_router(recommendation.router)
