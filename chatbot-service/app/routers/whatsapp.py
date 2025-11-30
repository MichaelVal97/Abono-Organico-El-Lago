from fastapi import APIRouter, Form, Request
from twilio.twiml.messaging_response import MessagingResponse
from app.services.ai_service import ai_service
from app.services.product_service import product_service

router = APIRouter()

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    # Get form data (Twilio sends data as form-urlencoded)
    form_data = await request.form()
    incoming_msg = form_data.get('Body', '').strip()
    sender = form_data.get('From', '')
    
    print(f"Message from {sender}: {incoming_msg}")
    
    # Get product context
    context = await product_service.get_product_context()
    
    # Get AI response
    ai_response = await ai_service.get_response(incoming_msg, context)
    
    # Create Twilio response
    resp = MessagingResponse()
    msg = resp.message()
    msg.body(ai_response)
    
    return str(resp)

@router.get("/whatsapp/webhook")
async def verify_webhook():
    return {"status": "active", "message": "WhatsApp webhook is running"}
