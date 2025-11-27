'use server';

/**
 * @fileOverview Summarizes customer feedback for the 'Estiércol en Bultos' product.
 *
 * - summarizeCustomerFeedback - A function that takes customer feedback as input and returns a summary of positive and negative aspects.
 * - SummarizeCustomerFeedbackInput - The input type for the summarizeCustomerFeedback function.
 * - SummarizeCustomerFeedbackOutput - The return type for the summarizeCustomerFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCustomerFeedbackInputSchema = z.object({
  feedback: z
    .string()
    .describe('The customer feedback to summarize for Estiércol en Bultos.'),
});
export type SummarizeCustomerFeedbackInput = z.infer<
  typeof SummarizeCustomerFeedbackInputSchema
>;

const SummarizeCustomerFeedbackOutputSchema = z.object({
  positiveSummary: z
    .string()
    .describe('A summary of the positive feedback, including reasoning.'),
  negativeSummary: z
    .string()
    .describe('A summary of the negative feedback, including reasoning.'),
});
export type SummarizeCustomerFeedbackOutput = z.infer<
  typeof SummarizeCustomerFeedbackOutputSchema
>;

export async function summarizeCustomerFeedback(
  input: SummarizeCustomerFeedbackInput
): Promise<SummarizeCustomerFeedbackOutput> {
  return summarizeCustomerFeedbackFlow(input);
}

const summarizeCustomerFeedbackPrompt = ai.definePrompt({
  name: 'summarizeCustomerFeedbackPrompt',
  input: {schema: SummarizeCustomerFeedbackInputSchema},
  output: {schema: SummarizeCustomerFeedbackOutputSchema},
  prompt: `You are an AI assistant helping a business owner understand customer feedback for their product, 'Estiércol en Bultos'.

  Summarize the positive and negative aspects of the following customer feedback, and provide reasoning for each summary:

  Feedback: {{{feedback}}}

  Format your response as follows:

  Positive Summary: [Summary of positive feedback, including reasoning]
  Negative Summary: [Summary of negative feedback, including reasoning]`,
});

const summarizeCustomerFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerFeedbackFlow',
    inputSchema: SummarizeCustomerFeedbackInputSchema,
    outputSchema: SummarizeCustomerFeedbackOutputSchema,
  },
  async input => {
    const {output} = await summarizeCustomerFeedbackPrompt(input);
    return output!;
  }
);
