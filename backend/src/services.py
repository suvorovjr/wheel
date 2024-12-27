from functools import lru_cache
from fastapi import Depends
from src.sessions import get_async_session
from aiohttp import ClientSession
from src.settings import settings
from src.logg import logger


class SendService:
    base_url = "https://api.notisend.ru/v1/email/messages"

    def __init__(self, session: ClientSession):
        self._session = session

    async def send_message(self, email: str, html_message: str) -> None:
        headers = SendService._get_headers()
        data = {
            "from_email": settings.from_email,
            "to": email,
            "subject": "Вот подарок!",
            "html": html_message,
            "from_name": "Сервизория",
        }
        async with self._session.post(
            url=self.base_url, headers=headers, json=data
        ) as response:
            if response.status != 201:
                body = await response.json()
                logger.error(
                    "Произошла ошибка при отправке сообщения:{}. Пытался отправить сообщение на email: '{}'".format(
                        body, email
                    )
                )
            else:
                logger.info("Письмо успешно отправлено на почту: {}".format(email))

    @staticmethod
    def _get_headers() -> dict[str, str]:
        headers = {
            "Authorization": f"Bearer {settings.send_api_key}",
            "Content-Type": "application/json",
        }
        return headers


@lru_cache
def get_send_service(async_session: ClientSession = Depends(get_async_session)):
    send_service = SendService(session=async_session)
    return send_service
