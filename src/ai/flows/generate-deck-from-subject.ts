'use server';
/**
 * @fileOverview A Genkit flow for generating a flashcard deck based on a given subject or description.
 *
 * - generateDeckFromSubject - A function that handles the flashcard deck generation process.
 * - GenerateDeckFromSubjectInput - The input type for the generateDeckFromSubject function.
 * - GenerateDeckFromSubjectOutput - The return type for the generateDeckFromSubject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeckFromSubjectInputSchema = z.object({
  subject: z
    .string()
    .describe('The subject or brief description for which to generate flashcards.'),
});
export type GenerateDeckFromSubjectInput = z.infer<
  typeof GenerateDeckFromSubjectInputSchema
>;

const FlashcardSchema = z.object({
  question: z.string().describe('The question for the flashcard.'),
  answer: z.string().describe('The answer to the flashcard question.'),
});

const GenerateDeckFromSubjectOutputSchema = z.object({
  deck: z.array(FlashcardSchema).describe('An array of flashcards, each with a question and an answer.'),
});
export type GenerateDeckFromSubjectOutput = z.infer<
  typeof GenerateDeckFromSubjectOutputSchema
>;

export async function generateDeckFromSubject(
  input: GenerateDeckFromSubjectInput
): Promise<GenerateDeckFromSubjectOutput> {
  return generateDeckFromSubjectFlow(input);
}

const generateDeckFromSubjectPrompt = ai.definePrompt({
  name: 'generateDeckFromSubjectPrompt',
  input: {schema: GenerateDeckFromSubjectInputSchema},
  output: {schema: GenerateDeckFromSubjectOutputSchema},
  prompt: `You are an expert at creating educational flashcards.

Generate a comprehensive flashcard deck consisting of at least 5 unique flashcards (question and answer pairs) for the following subject or description:

Subject: {{{subject}}}

Ensure that the questions cover key concepts and the answers are concise and accurate. The output MUST be a JSON array of objects, where each object has a 'question' and an 'answer' property.`,
});

const generateDeckFromSubjectFlow = ai.defineFlow(
  {
    name: 'generateDeckFromSubjectFlow',
    inputSchema: GenerateDeckFromSubjectInputSchema,
    outputSchema: GenerateDeckFromSubjectOutputSchema,
  },
  async input => {
    const {output} = await generateDeckFromSubjectPrompt(input);
    return output!;
  }
);
