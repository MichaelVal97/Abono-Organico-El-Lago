'use server';

import { summarizeCustomerFeedback, type SummarizeCustomerFeedbackInput, type SummarizeCustomerFeedbackOutput } from '@/ai/flows/summarize-customer-feedback';
import { z } from 'zod';

const schema = z.object({
  feedback: z.string().min(10, { message: 'El feedback debe tener al menos 10 caracteres.' }),
});

type FormState = {
  success: boolean;
  message: string;
  summary?: SummarizeCustomerFeedbackOutput;
}

export async function getFeedbackSummary(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const validatedFields = schema.safeParse({
    feedback: formData.get('feedback'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación.',
      summary: undefined,
    };
  }

  const feedbackInput: SummarizeCustomerFeedbackInput = {
    feedback: validatedFields.data.feedback,
  };

  try {
    const summary = await summarizeCustomerFeedback(feedbackInput);
    return {
        success: true,
        message: 'Resumen generado con éxito.',
        summary,
    }
  } catch (error) {
    console.error(error);
    return {
        success: false,
        message: 'Error al generar el resumen con IA.',
        summary: undefined,
    }
  }
}
