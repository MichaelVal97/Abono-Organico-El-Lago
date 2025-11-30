import httpx
from app.config import settings

class ProductService:
    def __init__(self):
        self.api_url = settings.NESTJS_API_URL

    async def get_all_products(self):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.api_url}/products")
                if response.status_code == 200:
                    return response.json()
                return []
        except Exception as e:
            print(f"Error fetching products: {e}")
            return []

    async def get_product_context(self) -> str:
        """
        Fetches products and formats them as a string context for the AI
        """
        products = await self.get_all_products()
        if not products:
            return "No hay información de productos disponible en este momento."
            
        context = "Inventario actual de productos:\n"
        for p in products:
            context += f"- {p['name']}: ${p['price']} (Stock: {p['stock']})\n"
            
        return context

product_service = ProductService()
