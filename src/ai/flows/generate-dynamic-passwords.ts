// This file is no longer used for password generation to avoid API rate limits.
// Local password generation is now handled in /src/lib/game-logic.ts
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDynamicPasswordInputSchema = z.object({
  difficultyLevel: z
    .number()
    .min(1)
    .max(6)
    .describe('The difficulty level of the password (1-6).'),
  includeSpecialChars: z
    .boolean()
    .describe('Whether to include special characters in the password.'),
  includeUppercase: z
    .boolean()
    .describe('Whether to include uppercase letters in the password.'),
  passwordLength: z
    .number()
    .min(4)
    .max(16)
    .describe('The desired length of the password.'),
});
export type GenerateDynamicPasswordInput = z.infer<
  typeof GenerateDynamicPasswordInputSchema
>;

const GenerateDynamicPasswordOutputSchema = z.object({
  password: z.string().describe('The generated password.'),
});
export type GenerateDynamicPasswordOutput = z.infer<
  typeof GenerateDynamicPasswordOutputSchema
>;

export async function generateDynamicPassword(
  input: GenerateDynamicPasswordInput
): Promise<GenerateDynamicPasswordOutput> {
  return generateDynamicPasswordFlow(input);
}

const generateDynamicPasswordPrompt = ai.definePrompt({
  name: 'generateDynamicPasswordPrompt',
  input: {schema: GenerateDynamicPasswordInputSchema},
  output: {schema: GenerateDynamicPasswordOutputSchema},
  prompt: `You are a password generator. Generate a password based on the following criteria:\n\nDifficulty Level: {{{difficultyLevel}}}\nInclude Special Characters: {{{includeSpecialChars}}}\nInclude Uppercase Letters: {{{includeUppercase}}}\nPassword Length: {{{passwordLength}}}\n\nEnsure the password meets all specified criteria. Return only the generated password in the 'password' field.`,
});

const generateDynamicPasswordFlow = ai.defineFlow(
  {
    name: 'generateDynamicPasswordFlow',
    inputSchema: GenerateDynamicPasswordInputSchema,
    outputSchema: GenerateDynamicPasswordOutputSchema,
  },
  async input => {
    // This is a dummy implementation to avoid API calls during local development.
    // The actual password generation logic is in /src/lib/game-logic.ts
    const dummyPassword = Math.random().toString(36).slice(-input.passwordLength);
    return { password: dummyPassword };
  }
);
