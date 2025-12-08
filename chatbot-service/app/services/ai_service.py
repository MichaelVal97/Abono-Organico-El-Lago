import re
from app.config import settings

class AIService:
    def __init__(self):
        self.product = {
            "name": "Bulto de 50 kg de compost",
            "price": "$25,000 COP",
            "desc": "Abono orgánico de alta calidad. Ideal para todo tipo de cultivos, mejorando la estructura del suelo y aportando nutrientes esenciales.",
            "discount": "Descuento especial para pedidos mayores a 100 unidades"
        }

    async def get_response(self, message: str, context: str = "") -> str:
        try:
            message_lower = message.lower()
            
            # Saludos
            if any(word in message_lower for word in ['hola', 'buenos', 'buenas', 'hey', 'hi']):
                return "¡Hola! 👋 Soy tu asistente de Abono Orgánico El Lago. ¿En qué puedo ayudarte hoy? Puedo informarte sobre nuestros productos, precios o recomendarte el mejor abono para tus plantas."
            
            # Precios
            if any(word in message_lower for word in ['precio', 'costo', 'cuanto', 'cuánto', 'valor']):
                return f"💰 **Nuestro Producto:**\n\n• {self.product['name']}: {self.product['price']}\n\n📦 {self.product['discount']}\n\n¿Quieres hacer un pedido?"
            
            # Producto / Información
            if any(word in message_lower for word in ['producto', 'compost', 'abono', 'bulto', 'información', 'info']):
                return f"✅ **{self.product['name']}**\n\n💰 Precio: {self.product['price']}\n\n📝 {self.product['desc']}\n\n🎁 {self.product['discount']}\n\n¿Te gustaría hacer un pedido?"
            
            # Recomendaciones
            if any(word in message_lower for word in ['recomendar', 'mejor', 'cual', 'cuál', 'qué usar', 'sirve']):
                return f"🌱 Nuestro **{self.product['name']}** es perfecto para:\n\n• Todo tipo de cultivos\n• Mejorar la estructura del suelo\n• Aportar nutrientes esenciales\n\n💰 {self.product['price']}\n🎁 {self.product['discount']}\n\n¿Quieres saber más?"
            
            # Comprar
            if any(word in message_lower for word in ['comprar', 'pedido', 'orden', 'adquirir']):
                return "¡Excelente! 🛒 Puedes hacer tu pedido de dos formas:\n\n1. 📱 WhatsApp: +57 316 416 0587\n2. 🌐 Directamente en nuestra página web\n\n¿Necesitas ayuda con algo más?"
            
            # Contacto
            if any(word in message_lower for word in ['contacto', 'teléfono', 'whatsapp', 'ubicación', 'dirección']):
                return "📞 **Contáctanos:**\n\n• WhatsApp: +57 316 416 0587 / +57 312 378 1848\n• Email: abonoellago@gmail.com\n• Ubicación: Vereda Canelon, Cajicá\n\n¿En qué más puedo ayudarte?"
            
            # Ayuda general
            if any(word in message_lower for word in ['ayuda', 'help', 'información', 'info']):
                return "Puedo ayudarte con:\n\n✓ Información de productos\n✓ Precios y disponibilidad\n✓ Recomendaciones personalizadas\n✓ Realizar pedidos\n✓ Datos de contacto\n\n¿Qué necesitas saber?"
            
            # Despedida
            if any(word in message_lower for word in ['gracias', 'adios', 'adiós', 'chao', 'bye']):
                return "¡Gracias por contactarnos! 🌿 Estamos aquí cuando nos necesites. ¡Que tengas un excelente día!"
            
            # Respuesta por defecto
            return "Entiendo que necesitas ayuda. Puedo informarte sobre:\n\n• 📦 Nuestros productos y precios\n• 🌱 Recomendaciones para tu cultivo\n• 🛒 Cómo hacer un pedido\n• 📞 Información de contacto\n\n¿Qué te gustaría saber?"
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "Disculpa, tuve un problema. ¿Podrías reformular tu pregunta?"

ai_service = AIService()
