
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-orange">Prime Properties</h3>
            <p className="text-gray-300">
              Your trusted partner in real estate. We help you find the perfect property and make your dreams a reality.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-brand-orange cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-brand-orange cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-brand-orange cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-brand-orange cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Home
              </Link>
              <Link to="/archive" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Properties
              </Link>
              <Link to="/signin" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="block text-gray-300 hover:text-brand-orange transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Our Projects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Projects</h3>
            <div className="space-y-2 text-gray-300">
              <div className="block hover:text-brand-orange transition-colors cursor-pointer">
                Downtown Luxury Condos
              </div>
              <div className="block hover:text-brand-orange transition-colors cursor-pointer">
                Suburban Family Homes
              </div>
              <div className="block hover:text-brand-orange transition-colors cursor-pointer">
                Commercial Spaces
              </div>
              <div className="block hover:text-brand-orange transition-colors cursor-pointer">
                Investment Properties
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-orange mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  123 Real Estate Ave<br />
                  City Center, State 12345
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-orange flex-shrink-0" />
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-orange flex-shrink-0" />
                <p className="text-gray-300">info@primeproperties.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Prime Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
