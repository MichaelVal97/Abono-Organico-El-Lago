"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePlantFlow = void 0;
const genkit_1 = require("./genkit");
const zod_1 = require("zod");
const PlantAnalysisSchema = zod_1.z.object({
    species: zod_1.z.object({
        scientific: zod_1.z.string(),
        common: zod_1.z.array(zod_1.z.string()),
        confidence: zod_1.z.number(),
    }),
    healthStatus: zod_1.z.enum(['healthy', 'needs_attention', 'critical']),
    issues: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.string(),
        severity: zod_1.z.enum(['low', 'medium', 'high']),
        description: zod_1.z.string(),
        symptoms: zod_1.z.array(zod_1.z.string()),
    })),
    recommendations: zod_1.z.array(zod_1.z.object({
        action: zod_1.z.string(),
        priority: zod_1.z.enum(['immediate', 'soon', 'routine']),
        details: zod_1.z.string(),
    })),
});
exports.analyzePlantFlow = genkit_1.ai.defineFlow({
    name: 'analyzePlant',
    inputSchema: zod_1.z.object({
        images: zod_1.z.array(zod_1.z.string()),
    }),
    outputSchema: PlantAnalysisSchema,
}, async (input) => {
    const prompt = `Analiza esta(s) imagen(es) de planta como un agrónomo experto.

Proporciona un análisis completo incluyendo:

1. IDENTIFICACIÓN DE LA PLANTA
   - Nombre científico
   - Nombres comunes (en español)
   - Nivel de confianza (0-100)

2. EVALUACIÓN DE SALUD
   - Estado general de salud (healthy/needs_attention/critical)
   - Problemas específicos detectados (deficiencias nutricionales, enfermedades, plagas)
   - Severidad de cada problema (low/medium/high)
   - Síntomas visibles

3. RECOMENDACIONES
   - Acciones inmediatas necesarias
   - Recomendaciones de fertilizantes orgánicos
   - Medidas preventivas
   - Ajustes de riego/luz solar

Enfócate en problemas que puedan resolverse con fertilizantes orgánicos, compost o enmiendas del suelo.
Sé específico y práctico en tus recomendaciones.`;
    const result = await genkit_1.ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt,
        config: {
            temperature: 0.3,
        },
        output: {
            schema: PlantAnalysisSchema,
        },
    });
    return result.output;
});
//# sourceMappingURL=plant-analysis.js.map