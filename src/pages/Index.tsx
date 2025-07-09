
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Bath, Bed, Square } from 'lucide-react';
import Header from '@/components/Header';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProperties = [
    {
      id: 1,
      title: "Modern Downtown Loft",
      price: 450000,
      location: "Downtown District",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: 750000,
      location: "Suburban Hills",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      price: 225000,
      location: "Arts Quarter",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=600&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-700 to-green-900 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Find Your Dream Home
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover the perfect property from our curated collection of premium homes and apartments
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-4 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Enter location, property type, or keyword..."
                  className="pl-10 border-0 text-gray-900 focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/archive">
                <Button className="bg-green-600 hover:bg-green-700 px-8">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked properties that offer exceptional value and stunning features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      Ksh {property.price.toLocaleString()}
                    </span>
                    <Link to={`/listing/${property.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/archive">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your New Home?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {/* <Link to="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link> */}
            <Link to="/archive">
              <Button size="lg" variant="outline" className="border-orange-600 text-black hover:bg-orange-800 hover:text-white">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
