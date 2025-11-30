from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ai_service import ai_service
from app.services.product_service import product_service
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send welcome message
        await manager.send_personal_message(
            json.dumps({
                "type": "bot",
                "text": "¡Hola! Soy el asistente virtual de Abono Orgánico El Lago. ¿En qué puedo ayudarte hoy?"
            }),
            websocket
        )
        
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("text", "")
            
            # Get product context
            context = await product_service.get_product_context()
            
            # Get AI response
            ai_response = await ai_service.get_response(user_message, context)
            
            # Send response
            await manager.send_personal_message(
                json.dumps({
                    "type": "bot",
                    "text": ai_response
                }),
                websocket
            )
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
