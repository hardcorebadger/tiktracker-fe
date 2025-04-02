import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Sparkles } from 'lucide-react';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <Music className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          Welcome to TikTrack!
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-primary" />
          <p className="text-xl text-muted-foreground">
            Your free trial has started
          </p>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>

        <p className="text-lg text-foreground mb-8">
          Get ready to unlock powerful insights about your music on TikTok.
          We're preparing your dashboard with everything you need to start tracking.
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full max-w-md text-lg"
            onClick={() => navigate('/dashboard')}
          >
            Go to dashboard now
          </Button>
          <p className="text-sm text-muted-foreground">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 