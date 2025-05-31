// 'use server'
'use server';
/**
 * @fileOverview AI agent that suggests products to upsell based on the customer's current cart.
 *
 * - getUpsellSuggestions - A function that returns upsell suggestions.
 * - UpsellSuggestionsInput - The input type for the getUpsellSuggestions function.
 * - UpsellSuggestionsOutput - The return type for the getUpsellSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpsellSuggestionsInputSchema = z.object({
  cartItems: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
    })
  ).describe('The items currently in the customer\'s cart.'),
});
export type UpsellSuggestionsInput = z.infer<typeof UpsellSuggestionsInputSchema>;

const UpsellSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of product names to suggest as upsells.'),
  reasoning: z.string().describe('The AI reasoning for providing the suggested upsells'),
});
export type UpsellSuggestionsOutput = z.infer<typeof UpsellSuggestionsOutputSchema>;

export async function getUpsellSuggestions(input: UpsellSuggestionsInput): Promise<UpsellSuggestionsOutput> {
  return upsellSuggestionsFlow(input);
}

const upsellSuggestionsPrompt = ai.definePrompt({
  name: 'upsellSuggestionsPrompt',
  input: {schema: UpsellSuggestionsInputSchema},
  output: {schema: UpsellSuggestionsOutputSchema},
  prompt: `You are an expert in maximizing revenue at a cannabis dispensary.
  Given the items in a customer's cart, suggest other products that the cashier should offer to the customer to increase the transaction value.
  Suggest specific product names, not just categories. Be concise in your suggestions and reasoning.

  Here are the items in the customer's cart:
  {{#each cartItems}}
  - {{name}} (Category: {{category}})
  {{/each}}`,
});

const upsellSuggestionsFlow = ai.defineFlow(
  {
    name: 'upsellSuggestionsFlow',
    inputSchema: UpsellSuggestionsInputSchema,
    outputSchema: UpsellSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await upsellSuggestionsPrompt(input);
    return output!;
  }
);
