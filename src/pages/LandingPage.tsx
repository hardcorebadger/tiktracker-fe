import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                <span className="block">Track TikTok sounds</span>
                <span className="block text-primary">for music labels</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Monitor your music's performance on TikTok. Simple, fast, and designed for professionals.
              </p>
              <div className="mt-8 sm:mt-12">
                <div className="rounded-md shadow">
                  <Link to="/signup">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:text-lg">
                      Get started
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 text-sm">
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
  );
};

export default LandingPage;
