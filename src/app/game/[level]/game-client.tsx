"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import CentralTerminal from '@/components/game/central-terminal';
import FileExplorer from '@/components/game/file-explorer';
import MiniConsole from '@/components/game/mini-console';
import BotAssistant from '@/components/game/bot-assistant';
import { Button } from '@/components/ui/button';
import type { FileNode, Clue } from '@/lib/game-logic';
import DraggableWindow from '@/components/game/draggable-window';
import { Folder, Terminal, Bot } from 'lucide-react';
import AdminLockScreen from '@/components/game/admin-lock-screen';
import { useAuth } from '@/hooks/use-auth';

interface GameClientProps {
  targetPassword: string;
  level: number;
  fileSystem: FileNode;
  clues: Clue[];
}

const levelDurations: { [key: number]: number } = {
    1: 90,      // 1.5 minutes
    2: 120,     // 2 minutes
    3: 300,     // 5 minutes
    4: 600,     // 10 minutes
    5: 900,     // 15 minutes
    6: 1800,    // 30 minutes
};

type WindowName = 'explorer' | 'console' | 'bot';


export default function GameClient({ targetPassword, level, fileSystem, clues }: GameClientProps) {
  const router = useRouter();
  const { completeMission } = useAuth();
  const [revealedPassword, setRevealedPassword] = useState<string[]>(Array(targetPassword.length).fill('_'));
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(levelDurations[level] || 300);
  const [isCracked, setIsCracked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [botMessages, setBotMessages] = useState<string[]>(['Système en ligne. Franchissez le pare-feu en craquant le mot de passe.']);
  
  const [windows, setWindows] = useState({
    explorer: { isOpen: false, zIndex: 1 },
    console: { isOpen: true, zIndex: 2 },
    bot: { isOpen: true, zIndex: 3 },
  });
  const [zIndexCounter, setZIndexCounter] = useState(4);
  
  const [adminPassword, setAdminPassword] = useState('');
  const [shuffledAdminPassword, setShuffledAdminPassword] = useState('');
  const [isFileExplorerUnlocked, setIsFileExplorerUnlocked] = useState(false);

  useEffect(() => {
    const adminPass = String(Math.floor(100 + Math.random() * 900));
    setAdminPassword(adminPass);

    if (level === 1) {
        const orderedClue = adminPass.split('').join(', ');
        setShuffledAdminPassword(orderedClue);
    } else {
        const shuffled = adminPass.split('').sort(() => Math.random() - 0.5).join(', ');
        setShuffledAdminPassword(shuffled);
    }
    
    setBotMessages(prev => [...prev, '[ALERTE SYSTÈME] Le système de fichiers est verrouillé. Accès administrateur requis.']);
  }, [level]);

  const bringToFront = (windowName: WindowName) => {
    // Check if it's already the top-most window
    if (windows[windowName].zIndex >= zIndexCounter - 1) return; 

    setZIndexCounter(prev => prev + 1);
    setWindows(prev => ({
        ...prev,
        [windowName]: { ...prev[windowName], zIndex: zIndexCounter }
    }));
  };

  const toggleWindow = (windowName: WindowName) => {
    const isOpening = !windows[windowName].isOpen;
    setWindows(prev => ({
        ...prev,
        [windowName]: { ...prev[windowName], isOpen: !prev[windowName].isOpen }
    }));
    if (isOpening) {
        bringToFront(windowName);
    }
  };

  const handleAdminUnlockAttempt = (attempt: string) => {
    if (attempt === adminPassword) {
      setIsFileExplorerUnlocked(true);
      addMessageToBot('Accès administrateur accordé. Explorateur de fichiers déverrouillé.');
    } else {
      addMessageToBot('> Tentative de déverrouillage admin échouée.');
    }
  };


  useEffect(() => {
    if (isCracked || isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      setRevealedPassword(targetPassword.split(''));
      setBotMessages(prev => [...prev, `Temps écoulé ! Échec de la mission. Le mot de passe était : ${targetPassword}. Retour au HUB...`]);
      setTimeout(() => router.push('/hub'), 8000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    if (timeLeft === 60 && !botMessages.some(m => m.includes('moins d\'une minute'))) {
        setBotMessages(prev => [...prev, 'Attention, il vous reste moins d\'une minute !']);
    }

    return () => clearInterval(timer);
  }, [isCracked, isGameOver, timeLeft, router, botMessages, targetPassword]);


  const handleAttempt = (guess: string) => {
    if (isCracked || isGameOver) return;
    
    const trimmedGuess = guess.trim();
    setBotMessages(prev => [...prev, `> Tentative avec "${trimmedGuess}"`]);

    const nextAttemptNumber = attempts + 1;
    setAttempts(nextAttemptNumber);

    if (trimmedGuess === targetPassword) {
      setIsCracked(true);
      setRevealedPassword(targetPassword.split(''));
      setBotMessages(prev => [...prev, 'Accès autorisé ! Système compromis. Récompenses ajoutées. Retour au HUB dans 5 secondes...']);
      completeMission(level);
      setTimeout(() => router.push('/hub'), 5000);
    } else {
      const newRevealed = [...revealedPassword];
      let correctChars = 0;
      for (let i = 0; i < targetPassword.length; i++) {
        if (trimmedGuess[i] === targetPassword[i]) {
          newRevealed[i] = targetPassword[i];
          correctChars++;
        }
      }
      setRevealedPassword(newRevealed);

      // Check if the password has been fully revealed through partial guesses
      if (!newRevealed.includes('_')) {
        setIsCracked(true);
        setBotMessages(prev => [...prev, 'Accès autorisé ! Tous les fragments ont été assemblés. Récompenses ajoutées. Système compromis. Retour au HUB dans 5 secondes...']);
        completeMission(level);
        setTimeout(() => router.push('/hub'), 5000);
        return; // Exit to prevent other messages
      }
      
      let nextBotMessage = `Accès refusé. ${correctChars} caractères corrects.`;
      if (trimmedGuess.length !== targetPassword.length) {
          nextBotMessage += ` La longueur est incorrecte (${targetPassword.length} attendus).`
      }
      setBotMessages(prev => [...prev, nextBotMessage]);
      
      if(nextAttemptNumber > 0 && nextAttemptNumber % 5 === 0){
          const clueIndex = (nextAttemptNumber / 5) - 1;
          if(clues[clueIndex]){
              setBotMessages(prev => [...prev, `[INDICE SYSTÈME] : ${clues[clueIndex].hint}`]);
          } else {
              setBotMessages(prev => [...prev, 'Le système semble résister... Continuez à chercher.']);
          }
      }
    }
  };
  
  const addMessageToBot = (message: string) => {
    setBotMessages(prev => [...prev, message]);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="p-2 md:p-4 h-screen max-h-screen overflow-hidden flex flex-col">
        <header className="flex items-center justify-between mb-2 flex-shrink-0">
            <h1 className="text-lg font-bold text-glow font-headline">LVL {level} // COCKPIT</h1>
            <div className="flex items-center gap-4 text-sm font-mono">
                <span>TENTATIVES : {attempts}</span>
                <span>TEMPS RESTANT : {formatTime(timeLeft)}</span>
                <Button variant="outline" size="sm" onClick={() => router.push('/hub')}>[ ANNULER ]</Button>
            </div>
        </header>

        <div className="relative flex-grow mb-4">
            <div className="absolute inset-0">
                <Card className="h-full border-primary bg-black/50">
                  <CentralTerminal revealedPassword={revealedPassword} onAttempt={handleAttempt} isCracked={isCracked} isGameOver={isGameOver} />
                </Card>
            </div>

            <main className="relative w-full h-full pointer-events-none"> {/* Desktop Area */}
                <DraggableWindow
                    title={isFileExplorerUnlocked ? "EXPLORATEUR DE FICHIERS" : "ACCÈS BLOQUÉ"}
                    isOpen={windows.explorer.isOpen}
                    onClose={() => toggleWindow('explorer')}
                    zIndex={windows.explorer.zIndex}
                    onFocus={() => bringToFront('explorer')}
                    initialPosition={{ x: 20, y: 10 }}
                >
                    {isFileExplorerUnlocked ? (
                        <FileExplorer fileSystem={fileSystem} onFileOpen={(path) => addMessageToBot(`> Fichier ouvert : ${path}`)} />
                    ) : (
                        <AdminLockScreen onUnlockAttempt={handleAdminUnlockAttempt} />
                    )}
                </DraggableWindow>

                <DraggableWindow
                    title="MINI-CONSOLE"
                    isOpen={windows.console.isOpen}
                    onClose={() => toggleWindow('console')}
                    zIndex={windows.console.zIndex}
                    onFocus={() => bringToFront('console')}
                    initialPosition={{ x: 440, y: 40 }}
                >
                    <MiniConsole 
                        fileSystem={fileSystem} 
                        onCommand={(cmd) => addMessageToBot(`> Commande exécutée : ${cmd}`)} 
                        clues={clues} 
                        mrfrClue={shuffledAdminPassword}
                    />
                </DraggableWindow>

                <DraggableWindow
                    title="BOT ASSISTANT"
                    isOpen={windows.bot.isOpen}
                    onClose={() => toggleWindow('bot')}
                    zIndex={windows.bot.zIndex}
                    onFocus={() => bringToFront('bot')}
                    initialPosition={{ x: 860, y: 70 }}
                >
                    <BotAssistant messages={botMessages} />
                </DraggableWindow>
            </main>
        </div>
        
        <footer className="w-full flex-shrink-0 flex justify-center py-2">
            <div className="flex gap-2 p-2 border border-primary bg-black/80 backdrop-blur-sm rounded-lg shadow-lg shadow-primary/20">
                <Button variant={windows.explorer.isOpen ? "secondary" : "ghost"} size="icon" onClick={() => toggleWindow('explorer')} className="text-primary hover:bg-primary/20">
                    <Folder />
                </Button>
                <Button variant={windows.console.isOpen ? "secondary" : "ghost"} size="icon" onClick={() => toggleWindow('console')} className="text-primary hover:bg-primary/20">
                    <Terminal />
                </Button>
                <Button variant={windows.bot.isOpen ? "secondary" : "ghost"} size="icon" onClick={() => toggleWindow('bot')} className="text-primary hover:bg-primary/20">
                    <Bot />
                </Button>
            </div>
        </footer>
    </div>
  );
}
