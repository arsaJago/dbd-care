'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { validateUsername, validatePassword } from '@/lib/utils';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getCurrentUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('dbdcare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const lowercaseUsername = username.toLowerCase().trim();

      // Check for hardcoded admin
      if (lowercaseUsername === 'admin' && password === 'admin123') {
        const adminUser: User = { username: 'admin', role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('dbdcare_user', JSON.stringify(adminUser));
        return { success: true };
      }

      // Query Firestore for user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', lowercaseUsername));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: 'Username tidak ditemukan' };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.password !== password) {
        return { success: false, error: 'Password salah' };
      }

      const loggedInUser: User = {
        username: userData.username,
        role: userData.role || 'user',
      };

      setUser(loggedInUser);
      localStorage.setItem('dbdcare_user', JSON.stringify(loggedInUser));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Terjadi kesalahan saat login' };
    }
  };

  const register = async (
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate username
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return { success: false, error: usernameValidation.error };
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Check password match
      if (password !== confirmPassword) {
        return { success: false, error: 'Password tidak cocok' };
      }

      const lowercaseUsername = username.toLowerCase().trim();

      // Check if username already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', lowercaseUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { success: false, error: 'Username sudah digunakan' };
      }

      // Create new user
      await addDoc(usersRef, {
        username: lowercaseUsername,
        password: password,
        role: 'user',
        createdAt: Timestamp.now(),
      });

      // Auto login after register
      const newUser: User = {
        username: lowercaseUsername,
        role: 'user',
      };

      setUser(newUser);
      localStorage.setItem('dbdcare_user', JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Terjadi kesalahan saat registrasi' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dbdcare_user');
    router.push('/');
  };

  const getCurrentUser = (): User | null => {
    return user;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
