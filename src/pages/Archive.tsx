import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Bath, Bed, Square, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import img1 from '@/assets/images/img1.jpg';
import img2 from '@/assets/images/img2.jpg';
import img3 from '@/assets/images/img3.webp';
import img4 from '@/assets/images/img4.webp';
import img5 from '@/assets/images/img5.png';
import img6 from '@/assets/images/img6.webp';
import img7 from '@/assets/images/img7.jpg';
import img8 from '@/assets/images/img8.jpg';
import img9 from '@/assets/images/img9.webp';
import img10 from '@/assets/images/img10.jpg';
import img11 from '@/assets/images/img11.jpg';


const Archive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const properties = [
    {
      id: 1,
      title: "Savannah Heights",
      price: 450000,
      location: "Kiambu Road",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      type: "Apartment",
      featured: true,
      image: img11
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: 750000,
      location: "Nairobi,Buruburu",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      type: "House",
      featured: true,
      image: img10
    },
    {
      id: 3,
      title: "Milimani Gardens",
      price: 225000,
      location: "Nakuru, Milimani",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      type: "Studio",
      featured: false,
      image: img6
    },
    {
      id: 4,
      title: "Spacious Townhouse",
      price: 525000,
      location: "Nairobi, Kileleshwa",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      type: "Townhouse",
      featured: false,
      image: img7
    },
    {
      id: 5,
      title: "Bahari House",
      price: 1200000,
      location: "Nairobi, Lavington",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2200,
      type: "Penthouse",
      featured: true,
      image: img3
    },
    {
      id: 6,
      title: "Nyota Villa",
      price: 375000,
      location: "Nairobi, Westlands",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      type: "Condo",
      featured: false,
      image: img2
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search and Filter Section */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by location, property type, or keyword..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-300000">$0 - $300k</SelectItem>
                  <SelectItem value="300000-600000">$300k - $600k</SelectItem>
                  <SelectItem value="600000-1000000">$600k - $1M</SelectItem>
                  <SelectItem value="1000000+">$1M+</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ bed</SelectItem>
                  <SelectItem value="2">2+ beds</SelectItem>
                  <SelectItem value="3">3+ beds</SelectItem>
                  <SelectItem value="4">4+ beds</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {properties.length} Properties Found
            </h1>
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="size">Square Footage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} to={`/listing/${property.id}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {property.featured && (
                        <Badge className="bg-brand-green text-white">Featured</Badge>
                      )}
                      <Badge variant="secondary">{property.type}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle favorite functionality here
                        }}
                      >
                        ♡
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-brand-green transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-brand-green">
                        Ksh.{property.price.toLocaleString()}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-brand-green hover:bg-orange-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button className="bg-brand-green text-white">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Archive;
