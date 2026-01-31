"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';

export default function AuthForm() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setIsSubmitting(true);
    try {
      await signIn(loginEmail, loginPassword);
      // Redirect is handled by AuthProvider
    } catch (error: any) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword) return;
    if (registerPassword !== registerConfirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    if (registerPassword.length < 6) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 6 caractères.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(registerEmail, registerPassword);
      // Redirect is handled by AuthProvider
    } catch (error: any) {
      toast({ title: "Erreur d'inscription", description: error.message, variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  const loginForm = (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">&gt; E-mail</Label>
        <Input 
          id="login-email" 
          type="email" 
          placeholder="hacker@domain.com" 
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required 
          className="bg-black border-primary focus:ring-primary"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">&gt; Mot de passe</Label>
        <Input 
          id="login-password" 
          type="password" 
          placeholder="************" 
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required 
          className="bg-black border-primary focus:ring-primary"
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && activeTab === 'login' ? "[ CONNEXION... ]" : "[ LANCER LA CONNEXION ]"}
      </Button>
    </form>
  );

  const registerForm = (
     <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email">&gt; E-mail</Label>
        <Input 
          id="register-email" 
          type="email" 
          placeholder="hacker@domain.com" 
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          required 
          className="bg-black border-primary focus:ring-primary"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">&gt; Mot de passe</Label>
        <Input 
          id="register-password" 
          type="password" 
          placeholder="Au moins 6 caractères" 
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required 
          minLength={6}
          className="bg-black border-primary focus:ring-primary"
          autoComplete="new-password"
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="register-confirm-password">&gt; Confirmer le mot de passe</Label>
        <Input 
          id="register-confirm-password" 
          type="password" 
          placeholder="************" 
          value={registerConfirmPassword}
          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
          required 
          className="bg-black border-primary focus:ring-primary"
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && activeTab === 'register' ? "[ INSCRIPTION... ]" : "[ CRÉER UN COMPTE ]"}
      </Button>
    </form>
  );

  return (
    <Card className="border-primary bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">// AUTHENTIFICATION SÉCURISÉE</CardTitle>
        <CardDescription>Entrez vos identifiants pour accéder au réseau.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-black border border-primary">
            <TabsTrigger value="login">[ CONNEXION ]</TabsTrigger>
            <TabsTrigger value="register">[ S'INSCRIRE ]</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            {loginForm}
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            {registerForm}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
