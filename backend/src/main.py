from contextlib import asynccontextmanager

from fastapi import FastAPI
from src import api
from fastapi.responses import ORJSONResponse
from aiohttp import ClientSession
from fastapi.middleware.cors import CORSMiddleware
from src import sessions


@asynccontextmanager
async def lifespan(_: FastAPI):
    sessions.async_session = ClientSession()

    yield

    await sessions.async_session.close()


app = FastAPI(
    title="Randomaizer",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api.router, prefix="/api/v1", tags=["message"])
