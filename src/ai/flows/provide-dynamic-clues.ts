'use server';

/**
 * @fileOverview Generates dynamic clues for the CyberCrack game, providing hints within the game's file explorer and mini-console.
 *
 * - provideDynamicClues - A function that generates dynamic clues based on the current game state.
 * - ProvideDynamicCluesInput - The input type for the provideDynamicClues function.
 * - ProvideDynamicCluesOutput - The return type for the provideDynamicClues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideDynamicCluesInputSchema = z.object({
  difficulty: z.number().describe('The difficulty level of the game (1-6).'),
  attempts: z.number().describe('The number of attempts the player has made.'),
  timeElapsed: z.number().describe('The time elapsed in the game (in seconds).'),
  passwordFragments: z.array(z.string()).describe('The known fragments of the password.'),
});
export type ProvideDynamicCluesInput = z.infer<typeof ProvideDynamicCluesInputSchema>;

const ProvideDynamicCluesOutputSchema = z.object({
  fileExplorerClue: z.string().describe('A clue to be placed in the file explorer.'),
  miniConsoleClue: z.string().describe('A clue to be placed in the mini-console.'),
});
export type ProvideDynamicCluesOutput = z.infer<typeof ProvideDynamicCluesOutputSchema>;

export async function provideDynamicClues(input: ProvideDynamicCluesInput): Promise<ProvideDynamicCluesOutput> {
  return provideDynamicCluesFlow(input);
}

const cluePrompt = ai.definePrompt({
  name: 'cluePrompt',
  input: {schema: ProvideDynamicCluesInputSchema},
  output: {schema: ProvideDynamicCluesOutputSchema},
  prompt: `You are the CyberCrack game's clue generator. Your role is to provide helpful but not immediately obvious clues to the player, guiding them to solve the password challenge.

  Difficulty: {{{difficulty}}}
  Attempts: {{{attempts}}}
  Time Elapsed: {{{timeElapsed}}}
  Password Fragments: {{{passwordFragments}}}

  Based on the game's difficulty, the number of attempts the player has made, the time elapsed, and the known fragments of the password, generate two clues:

  1.  fileExplorerClue: A subtle clue that can be hidden within the game's file explorer. This clue should be related to common hacking techniques, relevant file paths, or potential vulnerabilities that might lead the player to guess the password.
  2.  miniConsoleClue: A command or a piece of information that the player can use in the mini-console to gain further insights into the password. This could be a partial command, a hint about a database query, or a suggestion related to common exploits.

  Both clues should be designed to nudge the player in the right direction without directly revealing the password. They should be engaging and consistent with the retro-terminal aesthetic of the game.
  Each clue should be no more than 50 words.

  Format the output as a JSON object:
  {
  "fileExplorerClue": "...",
  "miniConsoleClue": "..."
  }`,
});

const provideDynamicCluesFlow = ai.defineFlow(
  {
    name: 'provideDynamicCluesFlow',
    inputSchema: ProvideDynamicCluesInputSchema,
    outputSchema: ProvideDynamicCluesOutputSchema,
  },
  async input => {
    const {output} = await cluePrompt(input);
    return output!;
  }
);
