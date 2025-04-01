
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-tiktrack-600 font-bold text-xl">
              TikTrack
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-tiktrack-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-tiktrack-600 transition-colors"
                >
                  Settings
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-tiktrack-600"
                >
                  Logout
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tiktrack-500"
                >
                  <Menu size={24} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-tiktrack-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-tiktrack-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-tiktrack-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
