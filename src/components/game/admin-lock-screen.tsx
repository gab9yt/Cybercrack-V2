"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AdminLockScreenProps {
  onUnlockAttempt: (password: string) => void;
}

export default function AdminLockScreen({ onUnlockAttempt }: AdminLockScreenProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    onUnlockAttempt(password);
    setPassword('');
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 text-center">
      <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="font-bold font-headline text-lg text-destructive">// ACCÈS RESTREINT //</h3>
      <p className="text-sm text-yellow-400 mb-6">Mot de passe administrateur requis pour déverrouiller le système de fichiers.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-2">
        <Input
          type="password"
          placeholder="> MOT DE PASSE ADMIN..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-black/50 font-mono text-center"
          autoFocus
        />
        <Button type="submit" className="w-full whitespace-nowrap">
          [ DÉVERROUILLER ]
        </Button>
      </form>
    </div>
  );
}
