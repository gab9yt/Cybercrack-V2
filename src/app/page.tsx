"use client";

import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/auth/auth-form';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  
  // The redirection logic is now centralized in AuthProvider
  // No useEffect needed here anymore.

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="w-full max-w-md p-4 text-center">
            <p className="text-glow text-2xl animate-pulse">SYNCHRONISATION AVEC LE RÉSEAU...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-center text-4xl font-bold text-glow md:text-6xl font-headline animate-pulse">
          CYBER-CRACK
        </h1>
        <AuthForm />
      </div>
    </div>
  );
}
