import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';
import { auth } from '@/firebase/clientApp';

export const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      router.prefetch('/login')
      await signOut(auth);
      // Wait briefly to ensure auth state has propagated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect
      router.push('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err as Error);
      return false; 
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading, error };
};