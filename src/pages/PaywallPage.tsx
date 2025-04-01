
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const PaywallPage = () => {
  const { mockSubscribe } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = () => {
    // Simulate subscription
    mockSubscribe();
    toast({
      title: "Subscription successful!",
      description: "Welcome to TikTrack's premium service.",
    });
    navigate('/dashboard');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 bg-tiktrack-600 sm:p-10 sm:pb-6">
              <div>
                <h3 className="text-center text-3xl font-extrabold text-white">
                  Premium Access
                </h3>
                <div className="mt-4 flex justify-center">
                  <div className="flex items-baseline text-white">
                    <span className="text-5xl font-extrabold tracking-tight">$200</span>
                    <span className="ml-1 text-2xl font-medium">/month</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pt-6 pb-8 bg-white sm:p-10 sm:pt-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    Unlimited sound tracking
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    Real-time view data
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    Trend analysis and charts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    Priority support
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-tiktrack-600 hover:bg-tiktrack-700 focus:ring-tiktrack-500 text-white font-bold py-3 px-4 rounded"
                >
                  Subscribe Now
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                Cancel anytime. No contracts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaywallPage;
