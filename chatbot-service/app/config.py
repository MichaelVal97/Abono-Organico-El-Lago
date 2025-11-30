import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    NESTJS_API_URL = os.getenv("NESTJS_API_URL", "http://localhost:3000")
    PORT = int(os.getenv("PORT", 8000))

settings = Settings()
