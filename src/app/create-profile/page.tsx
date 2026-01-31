"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const defaultAvatar = "https://i.pinimg.com/1200x/78/56/01/785601bb1e6397ca6d498d504c9a35fc.jpg";

export default function CreateProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [pseudo, setPseudo] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const finalPhotoURL = photoURL || defaultAvatar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo) {
        toast({ title: "Pseudo requis", description: "Veuillez entrer un pseudo.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        await updateProfile(pseudo, finalPhotoURL);
        toast({ title: "Profil créé !", description: "Bienvenue, hacker. Redirection vers le HUB..." });
        // The AuthProvider will handle the redirection automatically
    } catch (error: any) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center"><p className="text-glow animate-pulse">CHARGEMENT DU PROTOCOLE...</p></div>;
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary bg-black/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">// CRÉATION DU PROFIL HACKER</CardTitle>
          <CardDescription>Finalisez votre identité sur le réseau.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
                <Image 
                    src={finalPhotoURL} 
                    alt="Aperçu de l'avatar" 
                    width={100} 
                    height={100} 
                    className="rounded-full border-2 border-primary object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar; }} // Fallback
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pseudo">&gt; Pseudo</Label>
              <Input 
                id="pseudo" 
                type="text" 
                placeholder="Votre nom de code..." 
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required 
                className="bg-black border-primary focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoURL">&gt; URL de l'avatar (optionnel)</Label>
              <Input 
                id="photoURL" 
                type="url" 
                placeholder="https://... (ex: lien Pinterest)" 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="bg-black border-primary focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "[ INITIALISATION... ]" : "[ ACTIVER LE PROFIL ]"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
