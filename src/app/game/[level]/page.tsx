import { getPasswordSettingsForLevel, generateLocalPassword, generateFileSystem } from "@/lib/game-logic";
import GameClient from "./game-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type GamePageProps = {
  params: {
    level: string;
  };
};

export default async function GamePage({ params }: GamePageProps) {
  const level = parseInt(params.level, 10);
  if (isNaN(level) || level < 1 || level > 6) {
    return (
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
            <p className="text-glow text-destructive">Erreur : Niveau invalide spécifié.</p>
            <Link href="/hub">
              <Button variant="outline">Retourner au Hub</Button>
            </Link>
        </div>
    );
  }

  const passwordSettings = getPasswordSettingsForLevel(level);
  const password = generateLocalPassword(passwordSettings);
  const { fileSystem, clues } = generateFileSystem(password, level);

  return <GameClient targetPassword={password} level={level} fileSystem={fileSystem} clues={clues} />;
}
