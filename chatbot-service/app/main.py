from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="Chatbot Service - Abono Orgánico El Lago",
    description="Servicio de chatbots para WhatsApp y soporte web con IA",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Chatbot Service is running", "docs": "/docs"}

# Import routers
from app.routers import whatsapp, websocket
app.include_router(whatsapp.router)
app.include_router(websocket.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
