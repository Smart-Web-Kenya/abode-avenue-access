'use client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  User, 
  Home, 
  Users, 
  FileText, 
  Settings,
  MapPin,
  Tag,
  Building
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { getCurrentUserFromStorage, isAuthenticated, logout as authLogout } from '@/services/authService';

interface AdminLayoutProps {
  children: ReactNode;
}

interface UserData {
  name: string;
  role: string;
  email: string;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Users', href: '/admin/users', icon: Users },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileText,
      children: [
        { name: 'Recent Sales Report', href: '/admin/reports/sales' },
        { name: 'Top Performing Agents', href: '/admin/reports/agents' },
        { name: 'Property Views & Conversions', href: '/admin/reports/views' }
      ]
    },
    { name: 'Amenities', href: '/admin/amenities', icon: Settings },
    { name: 'Locations', href: '/admin/locations', icon: MapPin },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText }, // <-- Add this line
  ];

  // Check authentication and user role
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate('/signin');
        return false;
      }
      return true;
    };

    const loadUser = () => {
      try {
        const currentUser = getCurrentUserFromStorage();
        if (!currentUser) {
          throw new Error('No user data found');
        }

        // Check if user has admin or agent role
        if (currentUser.role !== 'admin' && currentUser.role !== 'agent') {
          console.log('User does not have admin/agent role, redirecting to /');
          navigate('/');
          return;
        }

        setUser({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    if (checkAuth()) {
      loadUser();
    }
  }, [navigate]);

  const handleLogout = () => {
    authLogout();
    navigate('/signin');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/dd3bf938-7550-47d8-9be1-5e186c5e635d.png" 
                alt="Merit Africa Homes" 
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <Badge variant="secondary" className="bg-brand-green/10 text-brand-green border-brand-green/20">
                  Admin Portal
                </Badge>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-orange rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User info & logout */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-brand-green" />
                  <span className="font-medium text-gray-700">
                    {user.name} ({user.role})
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/signin')}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.children && item.children.some(child => location.pathname === child.href));
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-brand-green/10 text-brand-green border-r-2 border-brand-green'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                    {/* Render submenu if item has children and is active */}
                    {item.children && isActive && (
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              to={child.href}
                              className={`block px-2 py-1 rounded transition-colors ${
                                location.pathname === child.href
                                  ? 'bg-brand-green/20 text-brand-green'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
