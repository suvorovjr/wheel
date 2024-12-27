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
    docs_url="/api/openapi",
    openapi_url="/api/openapi.json",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://89.108.121.202",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api.router, prefix="/api/v1", tags=["message"])
