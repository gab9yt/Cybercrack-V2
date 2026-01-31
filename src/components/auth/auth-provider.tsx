"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { rewardsByLevel } from '@/lib/game-logic';

// Expanded User type
export type User = {
  uid: string;
  email: string;
  pseudo?: string;
  photoURL?: string;
  xp: number;
  rank: string;
  crackedPasswords: number;
  coins: number;
  profileComplete: boolean;
};

// Auth Context Type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (pseudo: string, photoURL: string) => Promise<void>;
  completeMission: (level: number) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Mock user database
const MOCK_USERS_KEY = 'cybercrack-users';
const getMockUsers = (): { [email: string]: { pass: string, user: User } } => {
  if (typeof window === 'undefined') return {};
  const users = sessionStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : {};
};
const setMockUsers = (users: any) => {
  sessionStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('cybercrack-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // This effect handles all the routing logic
  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/';
    const isProfileCreationPage = pathname === '/create-profile';

    if (!user && !isAuthPage) {
      router.replace('/');
    } else if (user) {
      if (!user.profileComplete && !isProfileCreationPage) {
        router.replace('/create-profile');
      } else if (user.profileComplete && (isAuthPage || isProfileCreationPage)) {
        router.replace('/hub');
      }
    }
  }, [user, loading, pathname, router]);

  const signUp = async (email: string, pass: string) => {
    const users = getMockUsers();
    if (users[email]) {
      throw new Error("Un utilisateur avec cet e-mail existe déjà.");
    }

    const newUser: User = {
      uid: `mock-uid-${Date.now()}`,
      email,
      xp: 0,
      rank: "Stagiaire",
      crackedPasswords: 0,
      coins: 0,
      profileComplete: false,
    };

    users[email] = { pass, user: newUser };
    setMockUsers(users);
    sessionStorage.setItem('cybercrack-user', JSON.stringify(newUser));
    setUser(newUser);
    // The useEffect will handle redirection to /create-profile
  };

  const signIn = async (email: string, pass: string) => {
    const users = getMockUsers();
    if (!users[email] || users[email].pass !== pass) {
      throw new Error("Identifiants invalides.");
    }
    
    const loggedInUser = users[email].user;
    sessionStorage.setItem('cybercrack-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    // The useEffect will handle redirection
  };
  
  const signOut = () => {
    sessionStorage.removeItem('cybercrack-user');
    setUser(null);
    router.push('/');
  };

  const updateProfile = async (pseudo: string, photoURL: string) => {
    if (!user) throw new Error("Aucun utilisateur connecté.");
    
    const updatedUser: User = { 
        ...user, 
        pseudo, 
        photoURL: photoURL || 'https://i.pinimg.com/1200x/78/56/01/785601bb1e6397ca6d498d504c9a35fc.jpg',
        profileComplete: true 
    };

    const users = getMockUsers();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      setMockUsers(users);
    }

    sessionStorage.setItem('cybercrack-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    // The useEffect will handle redirection to /hub
  };
  
  const completeMission = async (level: number) => {
    if (!user) throw new Error("Aucun utilisateur connecté.");
    
    const rewards = rewardsByLevel[level] || { xp: 0, coins: 0 };
    
    const newXp = user.xp + rewards.xp;
    const newCoins = user.coins + rewards.coins;
    
    // Simple rank progression example
    let newRank = user.rank;
    if (newXp > 1000) newRank = "Légende";
    else if (newXp > 500) newRank = "Élite";
    else if (newXp > 250) newRank = "Spécialiste";
    else if (newXp > 100) newRank = "Agent";
    else if (newXp > 25) newRank = "Débutant";
    
    const updatedUser: User = {
      ...user,
      xp: newXp,
      coins: newCoins,
      rank: newRank,
      crackedPasswords: user.crackedPasswords + 1,
    };
    
    const users = getMockUsers();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      setMockUsers(users);
    }
    
    sessionStorage.setItem('cybercrack-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };


  const value = { user, loading, signIn, signUp, signOut, updateProfile, completeMission };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
