import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Crianca, Responsavel, Tio, Culto } from '@/types';

export function useFirestore<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!db) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const items: T[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      
      setData(items);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const getById = useCallback(async (id: string): Promise<T | null> => {
    if (!db) return null;
    
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (err) {
      console.error('Erro ao buscar documento:', err);
      return null;
    }
  }, [collectionName]);

  const create = async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    if (!db) return null;
    
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await fetchData();
      return docRef.id;
    } catch (err) {
      setError('Erro ao criar item');
      console.error('Erro ao criar documento:', err);
      return null;
    }
  };

  const update = async (id: string, item: Partial<T>): Promise<boolean> => {
    if (!db) return false;
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...item,
        updatedAt: Timestamp.now(),
      });
      await fetchData();
      return true;
    } catch (err) {
      setError('Erro ao atualizar item');
      console.error('Erro ao atualizar documento:', err);
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    if (!db) return false;
    
    try {
      await deleteDoc(doc(db, collectionName, id));
      await fetchData();
      return true;
    } catch (err) {
      setError('Erro ao excluir item');
      console.error('Erro ao excluir documento:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    getById,
    create,
    update,
    remove,
  };
}

// Hook específico para upload de imagens
export function useImageUpload() {
  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    if (!storage) return null;
    
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      return null;
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    if (!storage) return false;
    
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      return false;
    }
  };

  return { uploadImage, deleteImage };
}

// Hooks específicos para cada entidade
export function useCriancas() {
  return useFirestore<Crianca>('criancas');
}

export function useResponsaveis() {
  return useFirestore<Responsavel>('responsaveis');
}

export function useTios() {
  return useFirestore<Tio>('tios');
}

export function useCultos() {
  return useFirestore<Culto>('cultos');
} 