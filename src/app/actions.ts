"use server";

import { provideDynamicClues } from "@/ai/flows/provide-dynamic-clues";
import { z } from "zod";

const ClueRequestSchema = z.object({
  difficulty: z.number(),
  attempts: z.number(),
  timeElapsed: z.number(),
  passwordFragments: z.array(z.string()),
});

// This function is no longer the primary source of clues.
// Clue logic has been moved to the client-side in game-client.tsx and lib/game-logic.ts
export async function getDynamicClues(input: z.infer<typeof ClueRequestSchema>) {
  const validation = ClueRequestSchema.safeParse(input);
  if (!validation.success) {
    throw new Error("Invalid input for getting clues.");
  }

  try {
    // This call is maintained for now but the new logic doesn't depend on it.
    const clues = await provideDynamicClues(validation.data);
    return clues;
  } catch (error) {
    console.error("Error getting dynamic clues:", error);
    return {
      fileExplorerClue: "Error: Could not retrieve clue from Intel-Core.",
      miniConsoleClue: "Error: C-AI Subsystem offline.",
    };
  }
}
