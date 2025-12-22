import { ai } from './genkit';
import { z } from 'genkit';
import { Flow } from 'genkit';

const InputSchema = z.object({
  images: z.array(z.string()),
});

const PlantAnalysisSchema = z.object({
  species: z.object({
    scientific: z.string(),
    common: z.array(z.string()),
    confidence: z.number(),
  }),
  healthStatus: z.enum(['healthy', 'needs_attention', 'critical']),
  issues: z.array(
    z.object({
      type: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
      description: z.string(),
      symptoms: z.array(z.string()),
    }),
  ),
  recommendations: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(['immediate', 'soon', 'routine']),
      details: z.string(),
    }),
  ),
});

export type PlantAnalysis = z.infer<typeof PlantAnalysisSchema>;

export const analyzePlantFlow: Flow<typeof InputSchema, typeof PlantAnalysisSchema> = ai.defineFlow(
  {
    name: 'analyzePlant',
    inputSchema: InputSchema,
    outputSchema: PlantAnalysisSchema,
  },
  async (input): Promise<PlantAnalysis> => {
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

    const result = await ai.generate({
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

    return result.output as PlantAnalysis;
  },
);
