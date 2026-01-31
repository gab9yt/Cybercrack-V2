"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CentralTerminalProps {
  revealedPassword: string[];
  onAttempt: (attempt: string) => void;
  isCracked: boolean;
  isGameOver: boolean;
}

export default function CentralTerminal({ revealedPassword, onAttempt, isCracked, isGameOver }: CentralTerminalProps) {
  const [currentGuess, setCurrentGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCracked || isGameOver || !currentGuess) return;
    onAttempt(currentGuess);
    setCurrentGuess("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-primary/50">
        <h3 className="font-bold font-headline">// TERMINAL CENTRAL</h3>
      </div>
      <div className="flex-grow p-4 flex flex-col items-center justify-center">
        <div className="font-mono text-3xl md:text-5xl tracking-widest mb-8 text-center break-all">
          {revealedPassword.map((char, index) => (
            <span key={index} className={char === '_' ? 'text-gray-700' : 'text-primary'}>
              {char}
            </span>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="> ENTRER LE MOT DE PASSE..."
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              className="bg-black/50 font-mono text-lg"
              disabled={isCracked || isGameOver}
            />
            <Button type="submit" disabled={isCracked || isGameOver || !currentGuess} className="whitespace-nowrap">
              [ CRAQUER ]
            </Button>
          </div>
        </form>
        {isCracked && (
            <p className="mt-8 text-2xl text-glow animate-pulse">BRAVO ! MOT DE PASSE CRAQUÉ !</p>
        )}
        {isGameOver && !isCracked && (
            <p className="mt-8 text-2xl text-glow animate-pulse text-destructive">ÉCHEC DE LA MISSION</p>
        )}
      </div>
    </div>
  );
}
