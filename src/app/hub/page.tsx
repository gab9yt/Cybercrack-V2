"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LogOut, ShoppingCart, Swords, Bot, Users, Trophy, Coins, Award } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { rewardsByLevel } from '@/lib/game-logic';


const defaultAvatar = "https://i.pinimg.com/1200x/78/56/01/785601bb1e6397ca6d498d504c9a35fc.jpg";

export default function HubPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center"><p className="text-glow animate-pulse">AUTHENTIFICATION...</p></div>;
  }
  
  if (!user.profileComplete) {
    // This case should be handled by AuthProvider's redirect, but as a fallback:
    return <div className="flex h-screen items-center justify-center"><p className="text-glow animate-pulse">REDIRECTION VERS LA CRÉATION DE PROFIL...</p></div>;
  }

  const gameLevels = [
    { level: 1, duration: '1.5', difficulty: 'Stagiaire', description: "Une première incursion simple pour vous familiariser avec les outils de base du piratage." },
    { level: 2, duration: '2', difficulty: 'Débutant', description: "Le système est un peu plus sécurisé. Il faudra être attentif aux détails laissés dans les fichiers." },
    { level: 3, duration: '5', difficulty: 'Agent', description: "Un mot de passe contenant des majuscules. La complexité augmente, les indices sont plus subtils." },
    { level: 4, duration: '10', difficulty: 'Spécialiste', description: "Le temps presse et des caractères spéciaux s'invitent à la fête. Utilisez tous les outils à votre disposition." },
    { level: 5, duration: '15', difficulty: 'Élite', description: "Un véritable défi contre un système bien gardé. La concentration et la logique sont de mise." },
    { level: 6, duration: '30', difficulty: 'Légende', description: "La mission ultime. Seuls les hackers les plus perspicaces peuvent espérer réussir dans le temps imparti." },
  ].map(level => ({
    ...level,
    rewards: rewardsByLevel[level.level]
  }));

  const shopItems = [
      { name: 'Script de test automatique', price: 100, description: 'Teste automatiquement les modèles de mots de passe courants.' },
      { name: 'Scanner de vulnérabilités', price: 250, description: 'Analyse le système de fichiers à la recherche d\'indices potentiels.' },
      { name: 'Injecteur de base de données', price: 500, description: 'Simule une injection de base de données pour extraire des fragments.' },
  ];
  
  const handleLevelClick = (level: any) => {
    setSelectedLevel(level);
  };


  return (
    <>
      <div className="container mx-auto flex min-h-screen flex-col items-center p-4 pt-10">
        <header className="flex w-full max-w-4xl items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-glow font-headline">CYBER-CRACK // HUB</h1>
          <div className="flex items-center gap-4">
            <span className="font-mono text-primary flex items-center gap-2"><Coins /> {user.coins}</span>
            <Button variant="ghost" onClick={signOut} className="text-primary hover:bg-primary/20">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </header>

        <Card className="w-full max-w-4xl border-primary bg-black/50 backdrop-blur-sm">
          <CardContent className="p-4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-primary mb-4">
              <TabsTrigger value="profile"><User className="mr-2"/>Profil</TabsTrigger>
              <TabsTrigger value="games"><Swords className="mr-2"/>Missions</TabsTrigger>
              <TabsTrigger value="shop"><ShoppingCart className="mr-2"/>Boutique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="border-primary/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Image 
                      src={user.photoURL || defaultAvatar}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-primary object-cover"
                  />
                  <div>
                    <CardTitle className="text-primary">// Profil du Hacker</CardTitle>
                    <CardDescription>Bon retour, {user.pseudo}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg pt-4">
                  <p className="flex items-center"><Trophy className="inline mr-3 text-yellow-400" />Rang: <span className="font-bold ml-2 text-primary">{user.rank}</span></p>
                  <p className="flex items-center"><Award className="inline mr-3 text-blue-400" />Expérience: <span className="font-bold ml-2 text-primary">{user.xp} XP</span></p>
                  <p className="flex items-center"><Swords className="inline mr-3 text-red-400" />Mots de passe craqués: <span className="font-bold ml-2 text-primary">{user.crackedPasswords}</span></p>
                  <p className="flex items-center"><Coins className="inline mr-3 text-green-400" />Pièces: <span className="font-bold ml-2 text-primary">{user.coins}</span></p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="games">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center"><Bot className="mr-2" />Missions Solo</CardTitle>
                        <CardDescription>Affinez vos compétences contre des systèmes contrôlés par l'IA.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                      {gameLevels.map(g => (
                          <Button key={g.level} variant="outline" className="w-full justify-start" onClick={() => handleLevelClick(g)}>
                            Level {g.level}: {g.difficulty}
                          </Button>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-gray-600 bg-gray-900/50 text-gray-500">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Users className="mr-2" />Multijoueur</CardTitle>
                        <CardDescription>Défiez d'autres hackers en temps réel. (Bientôt disponible)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" disabled className="w-full">Course de vitesse (10 joueurs)</Button>
                      <Button variant="outline" disabled className="w-full">Mode Créateur</Button>
                    </CardContent>
                  </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="shop">
              <Card className="border-primary/50">
                  <CardHeader>
                      <CardTitle className="text-primary">// Scripts du marché noir</CardTitle>
                      <CardDescription>Achetez des outils avec vos {user.coins} pièces. (Fonctionnalité en développement)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {shopItems.map(item => (
                          <div key={item.name} className="flex justify-between items-center p-2 border border-primary/20 rounded-none">
                              <div>
                                  <h3 className="font-bold">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              <Button disabled>Acheter pour {item.price} P</Button>
                          </div>
                      ))}
                  </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={!!selectedLevel} onOpenChange={(isOpen) => !isOpen && setSelectedLevel(null)}>
        <DialogContent className="bg-black/80 border-primary text-primary">
            {selectedLevel && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-headline">// BRIEFING MISSION: NIVEAU {selectedLevel.level}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Difficulté : <span className="text-primary font-bold">{selectedLevel.difficulty}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 my-4">
                        <div>
                            <h3 className="font-bold text-lg text-primary/90">OBJECTIF</h3>
                            <p className="text-foreground/80">
                                Infiltrez le système et craquez le mot de passe principal avant la fin du temps imparti ({selectedLevel.duration} min).
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-primary/90">DESCRIPTION</h3>
                            <p className="text-foreground/80">
                                {selectedLevel.description}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-primary/90">RÉCOMPENSES POTENTIELLES</h3>
                            <div className="flex items-center gap-6 mt-2">
                                <p className="flex items-center gap-2 text-green-400"><Coins size={20} /> +{selectedLevel.rewards.coins} Pièces</p>
                                <p className="flex items-center gap-2 text-blue-400"><Award size={20} /> +{selectedLevel.rewards.xp} XP</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setSelectedLevel(null)}>Fermer</Button>
                        <Link href={`/game/${selectedLevel.level}`} passHref>
                            <Button>Lancer la Mission</Button>
                        </Link>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
