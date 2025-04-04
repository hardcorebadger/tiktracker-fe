import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { withPageTracking } from '@/components/withPageTracking';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error logging out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-8">
          <PageHeader
            title="Settings"
            description="Manage your account settings and preferences."
          />
        </div>

        <div className="bg-card shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mt-6">
              <dl className="divide-y divide-border">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    {user?.email}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Subscription
                  </dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    Premium Plan ($99/month)
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Account status
                  </dt>
                  <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2">
                    Active
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withPageTracking(SettingsPage, 'Settings');
