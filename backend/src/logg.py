from loguru import logger
import sys

LOG_FORMAT = (
    "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
    "<level>{message}</level>"
)

logger.remove()

logger.add(
    sys.stdout,
    format=LOG_FORMAT,
    level="DEBUG",
    colorize=True,
    backtrace=True,
    diagnose=True,
)

logger.add(
    "logs/app.log",
    format=LOG_FORMAT,
    level="INFO",
    rotation="10 MB",
    compression="zip",
    enqueue=True,
)

__all__ = ["logger"]
