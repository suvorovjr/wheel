from aiohttp import ClientSession


async_session: ClientSession | None = None


async def get_async_session() -> ClientSession:
    return async_session
