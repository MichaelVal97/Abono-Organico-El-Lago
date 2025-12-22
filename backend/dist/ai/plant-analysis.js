"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePlantFlow = void 0;
const genkit_1 = require("./genkit");
const genkit_2 = require("genkit");
const InputSchema = genkit_2.z.object({
    images: genkit_2.z.array(genkit_2.z.string()),
});
const PlantAnalysisSchema = genkit_2.z.object({
    species: genkit_2.z.object({
        scientific: genkit_2.z.string(),
        common: genkit_2.z.array(genkit_2.z.string()),
        confidence: genkit_2.z.number(),
    }),
    healthStatus: genkit_2.z.enum(['healthy', 'needs_attention', 'critical']),
    issues: genkit_2.z.array(genkit_2.z.object({
        type: genkit_2.z.string(),
        severity: genkit_2.z.enum(['low', 'medium', 'high']),
        description: genkit_2.z.string(),
        symptoms: genkit_2.z.array(genkit_2.z.string()),
    })),
    recommendations: genkit_2.z.array(genkit_2.z.object({
        action: genkit_2.z.string(),
        priority: genkit_2.z.enum(['immediate', 'soon', 'routine']),
        details: genkit_2.z.string(),
    })),
});
exports.analyzePlantFlow = genkit_1.ai.defineFlow({
    name: 'analyzePlant',
    inputSchema: InputSchema,
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
            format: 'json',
            schema: PlantAnalysisSchema,
        },
    });
    return result.output;
});
//# sourceMappingURL=plant-analysis.js.map