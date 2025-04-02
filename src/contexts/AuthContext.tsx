import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isPaidUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      console.log('Starting subscription check for user:', userId);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Subscription check timeout')), 3000);
      });

      console.log('Making Supabase query...');
      const queryPromise = supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', userId)
        .limit(1);

      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as { data: { status: string; current_period_end: string }[] | null; error: { message: string; details?: string; hint?: string } | null };

      console.log('Query completed');

      if (error) {
        console.error('Subscription check error:', error.message, error.details, error.hint);
        throw error;
      }

      console.log('Raw subscription data:', data);
      const subscription = data?.[0];
      console.log('Parsed subscription:', subscription);

      const isActive = subscription?.status === 'active' && 
        new Date(subscription.current_period_end) > new Date();
      
      console.log('Subscription active status:', isActive);
      setIsPaidUser(isActive);
    } catch (error) {
      console.error('Error in subscription check:', error instanceof Error ? error.message : error);
      if ('code' in (error as any)) console.error('Error code:', (error as any).code);
      if ('details' in (error as any)) console.error('Error details:', (error as any).details);
      setIsPaidUser(false);
    } finally {
      console.log('Subscription check completed');
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    let isMounted = false;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user || null);

      if (event === 'INITIAL_SESSION') {
        console.log('Auth mounted');
        isMounted = true;
        if (session?.user) {
          await checkSubscriptionStatus(session.user.id);
        } else {
          setIsPaidUser(false);
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setIsPaidUser(false);
        setIsLoading(false);
      } else if (!isMounted) {
        // Wait for auth to be mounted
        console.log('Waiting for auth to mount...');
      } else {
        // Auth is mounted and we have a non-initial event
        console.log('Auth is mounted and we have a non-initial event (signed in)');
        if (session?.user) {
          // Keep loading true until subscription check completes
          setIsLoading(true);
          await checkSubscriptionStatus(session.user.id);
          setIsLoading(false);
        } else {
          setIsPaidUser(false);
          setIsLoading(false);
        }
      }
    });

    // Initialize loading state
    setIsLoading(true);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsPaidUser(false);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isPaidUser,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
