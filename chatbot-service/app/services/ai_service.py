import google.generativeai as genai
from app.config import settings

# Configure Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
        self.chat = self.model.start_chat(history=[])
        
        self.system_prompt = """
        Eres un asistente virtual experto de "Abono Orgánico El Lago".
        Tu objetivo es ayudar a los clientes a elegir el mejor abono orgánico para sus cultivos.
        
        Productos disponibles:
        - Estiércol de Vaca ($15.99): Ideal para jardines y huertos.
        - Estiércol de Caballo ($18.50): Alto en nitrógeno, para plantas de rápido crecimiento.
        - Estiércol de Gallina/Gallinaza ($12.00): Rico en nutrientes, para cultivos intensivos.
        - Humus de Lombriz ($25.00): El mejor fertilizante natural, mejora la estructura del suelo.
        - Compost Orgánico Premium ($20.00): Balanceado para todo tipo de plantas.
        
        Reglas:
        1. Sé amable, profesional y conciso.
        2. Si te preguntan precios, dálos exactamente como aparecen arriba.
        3. Si te preguntan qué abono usar, pregunta qué tipo de plantas tienen.
        4. Si quieren comprar, indícales que pueden hacerlo en la página web o por WhatsApp.
        5. Responde siempre en español.
        """

    async def get_response(self, message: str, context: str = "") -> str:
        try:
            # Combine system prompt with context and user message
            full_prompt = f"{self.system_prompt}\n\nContexto adicional: {context}\n\nUsuario: {message}"
            
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento. ¿Podrías intentar de nuevo?"

ai_service = AIService()
