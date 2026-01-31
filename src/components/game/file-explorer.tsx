"use client";
import { useState } from "react";
import { File, Folder, ChevronRight, ChevronDown } from "lucide-react";
import type { FileNode } from '@/lib/game-logic';

interface FileExplorerProps {
  fileSystem: FileNode;
  onFileOpen: (path: string) => void;
}

function TreeNode({ node, path, onFileSelect }: { node: FileNode, path: string, onFileSelect: (content: string, path: string) => void }) {
  const [isOpen, setIsOpen] = useState(node.name === '/');
  const currentPath = path === '/' ? `/${node.name}` : `${path}/${node.name}`;

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
        onFileSelect(node.content || 'Le fichier est vide.', currentPath.replace('//', '/'));
    }
  };

  return (
    <div className="pl-4">
      <div className="flex items-center cursor-pointer hover:bg-primary/10 py-1" onClick={handleToggle}>
        {node.type === 'folder' ? (
          <>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Folder size={16} className="mx-1 text-primary/80" />
          </>
        ) : (
          <File size={16} className="ml-5 mr-1 text-primary/80" />
        )}
        <span>{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} path={currentPath} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({ fileSystem, onFileOpen }: FileExplorerProps) {
  const [fileContent, setFileContent] = useState('Cliquez sur un fichier pour voir son contenu.');
  const [filePath, setFilePath] = useState('...');

  const handleFileSelect = (content: string, path: string) => {
    setFileContent(content);
    setFilePath(path);
    onFileOpen(path);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-primary/50">
        <h3 className="font-bold font-headline">// EXPLORATEUR DE FICHIERS</h3>
      </div>
      <div className="flex-grow grid grid-rows-2 font-mono text-sm overflow-hidden">
        <div className="overflow-y-auto p-2">
          <TreeNode node={fileSystem} path="" onFileSelect={handleFileSelect} />
        </div>
        <div className="border-t border-primary/50 p-2 overflow-y-auto bg-black/50">
            <p className="text-primary/80">&gt; cat {filePath}</p>
            <p className="whitespace-pre-wrap">{fileContent}</p>
        </div>
      </div>
    </div>
  );
}
