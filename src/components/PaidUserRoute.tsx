
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PaidUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isPaidUser } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isPaidUser) {
    return <Navigate to="/paywall" replace />;
  }

  return <>{children}</>;
};

export default PaidUserRoute;
