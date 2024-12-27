from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import EmailStr, Field


class Settings(BaseSettings):
    base_dir: Path = Path(__file__).parent.parent

    send_api_key: str = Field(..., validation_alias="SEND_API_KEY")
    from_email: EmailStr = Field(..., validation_alias="FROM_EMAIL")
    to_email: str | None = Field(None, validation_alias="TO_EMAIL")
    html_message_path: Path = Field(
        default=base_dir / "html_message.html", validation_alias="HTML_MESSAGE"
    )

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    @property
    def to_email_list(self) -> list:
        if self.to_email is None:
            return []
        return self.to_email.split(",")

    @property
    def get_html_message(self) -> str:
        with open(self.html_message_path, "r", encoding="utf-8") as file:
            html_message = file.read()
            return html_message


settings = Settings()
