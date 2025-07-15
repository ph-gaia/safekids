import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Usuario } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          if (!db) return;
          const userDoc = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Usuario;
            setUser({
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth não está inicializado');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase Auth não está inicializado');
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const isParent = () => user?.tipo === 'parents';
  const isServant = () => user?.tipo === 'servants';

  return {
    user,
    loading,
    signIn,
    logout,
    isParent,
    isServant,
  };
} 