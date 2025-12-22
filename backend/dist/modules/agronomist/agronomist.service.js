"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgronomistService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
let AgronomistService = class AgronomistService {
    genAI;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async analyzePlant(files) {
        if (!files || files.length === 0) {
            throw new Error('No images provided');
        }
        try {
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
            });
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
            const imageParts = files.map((file) => ({
                inlineData: {
                    data: file.buffer.toString('base64'),
                    mimeType: file.mimetype,
                },
            }));
            console.log('Sending request to Gemini...');
            const result = await model.generateContent([prompt, ...imageParts]);
            const response = result.response;
            const text = response.text();
            console.log('Gemini Response:', text);
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('Invalid JSON response:', text);
                throw new Error('Invalid response format from AI');
            }
            const analysis = JSON.parse(jsonMatch[0]);
            return analysis;
        }
        catch (error) {
            console.error('Error in analyzePlant:', error);
            throw error;
        }
    }
};
exports.AgronomistService = AgronomistService;
exports.AgronomistService = AgronomistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AgronomistService);
//# sourceMappingURL=agronomist.service.js.map