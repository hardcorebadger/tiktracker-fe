import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <Link to="/" className="text-primary hover:text-primary/90 transition-colors">
                    <Music className="h-16 w-16" />
                    <span className="sr-only">TikTrack</span>
                  </Link>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  <span className="block">Track TikTok sounds</span>
                  <span className="block text-primary">for music labels</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Monitor your music's performance on TikTok. Simple, fast, and designed for professionals.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center">
                  <Link to="/signup" className="max-w-xs w-full">
                    <Button size="lg" className="w-full text-lg">
                      Get started
                    </Button>
                  </Link>
                  <div className="mt-4 text-sm">
                    <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
