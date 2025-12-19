import { Injectable } from '@nestjs/common';
import { AnalyzePlantResponseDto } from './dto/analyze-plant-response.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AgronomistService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyzePlant(files: Express.Multer.File[]): Promise<AnalyzePlantResponseDto> {
        if (!files || files.length === 0) {
            throw new Error('No images provided');
        }

        const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `Analiza esta(s) imagen(es) de planta como un agrónomo experto.

Proporciona un análisis completo en formato JSON con la siguiente estructura:

{
  "species": {
    "scientific": "Nombre científico de la planta",
    "common": ["Nombre común 1", "Nombre común 2"],
    "confidence": 85
  },
  "healthStatus": "healthy" | "needs_attention" | "critical",
  "issues": [
    {
      "type": "Tipo de problema (ej: Deficiencia de nitrógeno)",
      "severity": "low" | "medium" | "high",
      "description": "Descripción detallada del problema",
      "symptoms": ["Síntoma 1", "Síntoma 2"]
    }
  ],
  "recommendations": [
    {
      "action": "Acción recomendada",
      "priority": "immediate" | "soon" | "routine",
      "details": "Detalles específicos de la recomendación"
    }
  ]
}

Enfócate en problemas que puedan resolverse con fertilizantes orgánicos, compost o enmiendas del suelo.
Sé específico y práctico en tus recomendaciones.
Responde SOLO con el JSON, sin texto adicional.`;

        // Convert images to Gemini format
        const imageParts = files.map(file => ({
            inlineData: {
                data: file.buffer.toString('base64'),
                mimeType: file.mimetype,
            },
        }));

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        const text = response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
    }
}
