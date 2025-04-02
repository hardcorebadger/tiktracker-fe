import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Music, LineChart, Clock, Cloud } from 'lucide-react';
import Header from '@/components/Header';

const PaywallPage = () => {
  const { mockSubscribe } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = () => {
    mockSubscribe();
    toast({
      title: "Trial started!",
      description: "Welcome to TikTrack. Your 7-day free trial has begun.",
    });
    navigate('/thank-you');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Unlock your music's
              <br />
              potential today
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              First 7 days are free
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Unlimited Sound Tracking</h3>
                <p className="text-sm text-muted-foreground">
                Monitor unlimited TikTok sounds with real time high quality scraping.
                  
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                Track daily video creates over time to see how your sound is performing.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications about your sound's performance and trends.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Cloud Synced Data</h3>
                <p className="text-sm text-muted-foreground">
                  Access your analytics from anywhere, always in sync across devices.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center">
            <Button
              onClick={handleSubscribe}
              size="lg"
              className="w-full max-w-md text-lg font-medium"
            >
              Start free trial
              <span className="ml-2 text-primary-foreground/80">$200/m</span>
            </Button>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Cancel anytime. No contracts.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaywallPage;
