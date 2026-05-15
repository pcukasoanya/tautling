'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating flashcard decks from uploaded text documents.
 *
 * - generateDeckFromUploadedText - A function that handles the flashcard generation process.
 * - GenerateDeckFromUploadedTextInput - The input type for the generateDeckFromUploadedText function.
 * - GenerateDeckFromUploadedTextOutput - The return type for the generateDeckFromUploadedText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeckFromUploadedTextInputSchema = z.object({
  textDocument: z.string().describe('The content of the text document from which to generate flashcards.'),
});
export type GenerateDeckFromUploadedTextInput = z.infer<typeof GenerateDeckFromUploadedTextInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('The question for the flashcard.'),
  answer: z.string().describe('The answer to the flashcard question.'),
});

const GenerateDeckFromUploadedTextOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('An array of generated flashcards.'),
});
export type GenerateDeckFromUploadedTextOutput = z.infer<typeof GenerateDeckFromUploadedTextOutputSchema>;

export async function generateDeckFromUploadedText(
  input: GenerateDeckFromUploadedTextInput
): Promise<GenerateDeckFromUploadedTextOutput> {
  return generateDeckFromUploadedTextFlow(input);
}

const generateFlashcardDeckPrompt = ai.definePrompt({
  name: 'generateFlashcardDeckPrompt',
  input: { schema: GenerateDeckFromUploadedTextInputSchema },
  output: { schema: GenerateDeckFromUploadedTextOutputSchema },
  prompt: `You are an AI assistant specialized in creating concise and effective flashcards from provided text.

Your task is to analyze the given text document, extract key concepts and information, and transform them into a set of question-answer flashcards.

Ensure that each flashcard has a clear question and a direct, accurate answer based solely on the provided text.

Return the flashcards in a JSON array format, where each element is an object with 'question' and 'answer' fields.

Text Document:
{{textDocument}}
`,
});

const generateDeckFromUploadedTextFlow = ai.defineFlow(
  {
    name: 'generateDeckFromUploadedTextFlow',
    inputSchema: GenerateDeckFromUploadedTextInputSchema,
    outputSchema: GenerateDeckFromUploadedTextOutputSchema,
  },
  async (input) => {
    const { output } = await generateFlashcardDeckPrompt(input);
    if (!output) {
      throw new Error('Failed to generate flashcards.');
    }
    return output;
  }
);
