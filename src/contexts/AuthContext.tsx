import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { identify, setUserProperties, reset as resetMixpanel } from '@/services/mixpanel';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isPaidUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Simple cache for subscription status to avoid excessive API calls
 */
const subscriptionCache = new Map<string, {isActive: boolean, timestamp: number}>();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);

  /**
   * Check if user has an active subscription
   */
  const checkSubscription = async (userId: string) => {
    try {
      // Check cache first (valid for 5 minutes)
      const cached = subscriptionCache.get(userId);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp < 5 * 60 * 1000)) {
        console.log('Using cached subscription status');
        setIsPaidUser(cached.isActive);
        setUserProperties({
          subscription_status: cached.isActive ? 'active' : 'inactive'
        });
        return;
      }
      
      console.log('Checking subscription for user:', userId);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Subscription check failed:', error);
        setIsPaidUser(false);
        setUserProperties({
          subscription_status: 'error',
          subscription_error: error.message
        });
        return;
      }
      
      console.log('Subscription data received:', data);
      
      const isActive = (data?.status === 'active' || data?.status === 'trialing') && 
        new Date(data.current_period_end) > new Date();
      
      console.log('Subscription active status:', isActive, 'Current status:', data?.status);
      
      // Update cache
      subscriptionCache.set(userId, {
        isActive,
        timestamp: now
      });
      
      setIsPaidUser(isActive);
      
      // Update Mixpanel with subscription info
      setUserProperties({
        subscription_status: data?.status || 'none',
        subscription_active: isActive,
        subscription_end_date: data?.current_period_end,
        is_trial: data?.status === 'trialing'
      });
      
    } catch (err) {
      console.error('Error checking subscription:', err);
      setIsPaidUser(false);
      setUserProperties({
        subscription_status: 'error',
        subscription_error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };
  
  /**
   * Update session and check subscription
   */
  const updateSession = async (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user || null);
    
    if (newSession?.user) {
      // Identify user in Mixpanel
      identify(newSession.user.id);
      setUserProperties({
        $email: newSession.user.email,
        $name: newSession.user.user_metadata?.full_name,
        supabase_id: newSession.user.id,
        last_sign_in: new Date().toISOString(),
        auth_provider: newSession.user.app_metadata.provider
      });
      await checkSubscription(newSession.user.id);
    } else {
      setIsPaidUser(false);
    }
  };

  // Only use auth listener for initial load and external changes
  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth provider');
    
    // Clear subscription cache on mount to ensure fresh check
    subscriptionCache.clear();
    
    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('Safety timeout triggered');
        setIsLoading(false);
      }
    }, 3000);
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;
      
      console.log('Initial session loaded');
      if (initialSession?.user) {
        await updateSession(initialSession);
      } else {
        setSession(null);
        setUser(null);
        setIsPaidUser(false);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error('Error getting session:', error);
      if (mounted) setIsLoading(false);
    });
    
    // Set up listener ONLY for external auth changes (session expiry, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        console.log('External auth change detected:', event);
        // Only handle things that weren't triggered by our explicit methods
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await updateSession(newSession);
        }
      }
    );
    
    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);
  
  // Auth methods with direct state updates
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (!error && data.session) {
        await updateSession(data.session);
      }
      
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (!error && data.session) {
        await updateSession(data.session);
      }
      
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      
      // Reset Mixpanel on signout
      resetMixpanel();
      
      // Explicitly clear state instead of waiting for listener
      setUser(null);
      setSession(null);
      setIsPaidUser(false);
      subscriptionCache.clear();
    } catch (error) {
      console.error('Error signing out:', error);
      
      // Still clear state on error
      setUser(null);
      setSession(null);
      setIsPaidUser(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      // Can't directly handle response here because of redirect
      // Loading state will be reset on page reload after OAuth
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    console.log('Manually refreshing subscription status');
    if (user?.id) {
      // Clear the cache for this user
      subscriptionCache.delete(user.id);
      // Re-check subscription
      await checkSubscription(user.id);
    }
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
        refreshSubscription,
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
