from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr

from src.services import get_send_service, SendService
from src.settings import settings


router = APIRouter()


class Client(BaseModel):
    email: EmailStr
    name: str
    prize: str


async def send_email_background(
    send_message_service: SendService, client: Client, html_message: str
):
    """Фоновая задача для отправки email."""

    await send_message_service.send_message(email=client.email, html_message=html_message)

    html = f"<h1>Email={client.email}, имя={client.name}, приз={client.prize}</h1>"
    print(settings.to_email_list)
    for to in settings.to_email_list:
        await send_message_service.send_message(email=to, html_message=html)


@router.post("/send-message/")
async def send_message(
    client: Client,
    background_tasks: BackgroundTasks,
    send_message_service: SendService = Depends(get_send_service),
):
    html_message = settings.get_html_message.replace(
        "{Имя пользователя}", client.name
    ).replace("{Приз пользователя}", client.prize)

    background_tasks.add_task(
        send_email_background, send_message_service, client, html_message
    )

    return {
        "ok": True,
        "message": "Подарок отправлен Вам на почту. Сообщение могло попасть в папке «Спам».",
    }
