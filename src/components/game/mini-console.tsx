"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { FileNode, Clue } from '@/lib/game-logic';

interface MiniConsoleProps {
  fileSystem: FileNode;
  onCommand: (command: string) => void;
  clues: Clue[];
  mrfrClue: string;
}

const findNodeByPath = (path: string, fs: FileNode): FileNode | null => {
    const parts = path.split('/').filter(p => p);
    let currentNode: FileNode | undefined = fs;

    for (const part of parts) {
        if (currentNode?.type !== 'folder') return null;
        currentNode = currentNode.children?.find(n => n.name === part);
        if (!currentNode) return null;
    }
    return currentNode;
};

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function MiniConsole({ fileSystem, onCommand, clues, mrfrClue }: MiniConsoleProps) {
  const [history, setHistory] = useState<string[]>(['Tapez "/help" pour les commandes.']);
  const [command, setCommand] = useState("");
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const executeCommand = (cmd: string) => {
    onCommand(cmd);
    let output = `> ${cmd}\n`;
    const [mainCmd, ...args] = cmd.trim().split(' ');

    const secretClue = clues.find(c => c.command === mainCmd);
    if (secretClue && secretClue.commandOutput) {
        output += secretClue.commandOutput;
        setHistory(prev => [...prev, output]);
        setCommand("");
        return;
    }

    switch(mainCmd) {
        case '/help':
            output += 'Commandes disponibles:\n/help - Affiche cette aide\n/ls [chemin] - Liste les fichiers et dossiers\n/cat <chemin_fichier> - Affiche le contenu d\'un fichier\n/pwd - Affiche le répertoire actuel (toujours /)\n/scan - Recherche les vulnérabilités du système\n/netstat - Affiche les connexions réseau\n/mrfr - Lance le protocole de récupération de fragments M.R.F.R.';
            break;
        
        case '/mrfr':
            output += `Protocole M.R.F.R. initié...\nFragments de code d'accès admin récupérés : [ ${mrfrClue} ]`;
            break;

        case '/pwd':
            output += '/';
            break;

        case '/ls': {
            const path = args[0] || '/';
            const node = path === '/' ? fileSystem : findNodeByPath(path, fileSystem);
            if(node && node.type === 'folder' && node.children) {
                output += node.children.map(child => `${child.type === 'folder' ? 'd' : '-'} ${child.name}`).join('\n');
            } else {
                output += `Erreur: Chemin non trouvé ou n'est pas un dossier: ${path}`;
            }
            break;
        }

        case '/cat': {
            const path = args[0];
            if (!path) {
                output += 'Usage: /cat <chemin_fichier>';
                break;
            }
            const node = findNodeByPath(path, fileSystem);
            if(node && node.type === 'file') {
                output += node.content || 'Fichier vide.';
            } else {
                output += `Erreur: Fichier non trouvé ou est un dossier: ${path}`;
            }
            break;
        }

        case '/scan': {
            output += 'Scan en cours...\nAnalyse des ports... OK\nAnalyse des services... OK\nAnalyse du système de fichiers...\n';
            const fileClue = clues.find(c => c.type === 'file' && c.location);
            if (fileClue && fileClue.location) {
                const pathParts = fileClue.location.split('.');
                const extension = pathParts.length > 1 ? pathParts.pop() : undefined;
                
                if (extension) {
                    const vulnerabilityMessages = [
                        `[!] Vulnérabilité potentielle trouvée dans des fichiers de type (.${extension}).`,
                        `[!] Des métadonnées suspectes ont été détectées dans un fichier (.${extension}).`,
                        `[!] Une version non sécurisée d'un fichier (.${extension}) a été découverte.`,
                        `[!] Les permissions sur un fichier (.${extension}) sont trop permissives.`,
                    ];
                    output += getRandomElement(vulnerabilityMessages);
                } else {
                     output += '[!] Vulnérabilité potentielle trouvée dans un fichier sans extension.';
                }
            } else {
                output += '[!] Le scan n\'a révélé aucune anomalie critique dans le système de fichiers.';
            }
            break;
        }
        
        case '/netstat':
            output += 'Connexions réseau actives:\nPROTO  ADRESSE LOCALE      ADRESSE DISTANTE    ETAT\nTCP    127.0.0.1:7000      firewall-ext:80     ESTABLISHED\nTCP    127.0.0.1:7001      intel-service:443   ESTABLISHED';
            break;
        
        default:
            output += `Commande non trouvée : ${cmd}`;
            break;
    }
    setHistory(prev => [...prev, output]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    executeCommand(command);
    setCommand("");
  };

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-primary/50">
        <h3 className="font-bold font-headline">// MINI-CONSOLE</h3>
      </div>
      <div className="flex-grow p-2 font-mono text-sm overflow-y-auto">
        {history.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">{line}</p>
        ))}
        <div ref={endOfHistoryRef} />
      </div>
      <div className="p-2 border-t border-primary/50">
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="> Entrez une commande..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="bg-black/50 font-mono text-sm h-8"
          />
        </form>
      </div>
    </div>
  );
}
