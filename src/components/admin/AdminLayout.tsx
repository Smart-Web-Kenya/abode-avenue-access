
import { Link, useLocation } from 'react-router-dom';
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
  Building,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Amenities', href: '/admin/amenities', icon: Settings },
    { name: 'Locations', href: '/admin/locations', icon: MapPin },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Home', href: '/', icon: Home },
    { name: 'Logout', href: '/', icon: LogOut },

  ];

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
              {/* <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-orange rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button> */}
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            <Link to="/" className="inline-flex items-center justify-center p-2 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <LogOut className="h-5 w-5" />
            </Link>
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
                const isActive = location.pathname === item.href;
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
