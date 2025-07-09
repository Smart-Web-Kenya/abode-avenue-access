
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/dd3bf938-7550-47d8-9be1-5e186c5e635d.png" 
              alt="Merit Africa Homes" 
              className="h-20 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link to="/archive" className="text-gray-700 hover:text-teal-600 transition-colors">
              Properties
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-teal-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-teal-600 transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" className="text-gray-700">
                Go to Admin
              </Button>
            </Link>

            <Link to="/signin">
              {/* <Button variant="ghost" className="text-gray-700"> */}
              <Button className="bg-green-700 hover:bg-green-900 text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="hidden">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
