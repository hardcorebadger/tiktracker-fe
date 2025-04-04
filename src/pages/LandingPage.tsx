import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, LineChart, History, Bell, Zap, Shield, LucideIcon, Github, Twitter, Mail } from 'lucide-react';
import { TestSoundsTable } from '@/components/TestSoundsTable';
import { withPageTracking } from '@/components/withPageTracking';

const FeatureCard = ({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) => (
  <div className="flex flex-col items-start p-6 rounded-lg border border-border">
    <div className="p-2 rounded-md bg-brand-teal/10 mb-4">
      <Icon className="h-6 w-6 text-brand-teal" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Footer = () => (
  <footer className="border-t py-12 px-6">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          Made with <span className="text-brand-red">❤</span> by{" "}
          <a 
            href="https://jaketrefethen.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-brand-red transition-colors"
          >
            Jake Trefethen
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/hardcorebadger" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a 
            href="https://x.com/jaketref" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </a>
          <a 
            href="mailto:support@jaketrefethen.com" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a 
            href="https://www.jaketrefethen.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="https://www.jaketrefethen.com/terms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="https://www.jaketrefethen.com/cookies" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Hero Section */}
        <div className="relative px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-background to-background">
          <div className="mx-auto max-w-6xl py-24 sm:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Link to="/" className="text-brand-red hover:text-brand-red/90 transition-colors">
                  <Music className="h-16 w-16" />
                  <span className="sr-only">TikTrack</span>
                </Link>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4">
                Monitor Your TikTok Sounds
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional analytics for music professionals. Monitor your catalog's reach and growth across TikTok.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-brand-red hover:bg-brand-red/90 text-white">
                    Sign up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="relative px-6 py-16 lg:px-8 border-t bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
                Track Your Sounds' Growth
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Monitor video counts, track engagement metrics, and analyze growth trends across your entire catalog.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm">
              <TestSoundsTable useDemo={true} />
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Example data shown. Sign up to track your own sounds.
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative px-6 py-16 lg:px-8 border-t">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={LineChart}
                title="Real-time Analytics"
                description="Track video counts and engagement metrics for any TikTok sound in real-time."
              />
              <FeatureCard
                icon={History}
                title="Historical Data"
                description="Access comprehensive historical data to analyze growth trends and patterns."
              />
              <FeatureCard
                icon={Bell}
                title="Smart Alerts"
                description="Get notified when your sounds hit key milestones or show viral potential."
              />
              <FeatureCard
                icon={Zap}
                title="Batch Processing"
                description="Monitor multiple sounds simultaneously with efficient batch tracking."
              />
              <FeatureCard
                icon={Shield}
                title="Secure Access"
                description="Enterprise-grade security with role-based access control for your team."
              />
              <div className="flex items-center justify-center p-6 rounded-lg border border-brand-red/20 bg-brand-red/5">
                <div className="text-center">
                  <p className="text-lg font-semibold text-brand-red mb-2">Ready to start?</p>
                  <Link to="/signup">
                    <Button variant="outline" className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default withPageTracking(LandingPage, 'Landing Page');
