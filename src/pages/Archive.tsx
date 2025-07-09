
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Bath, Bed, Square, Filter } from 'lucide-react';
import Header from '@/components/Header';

const Archive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const properties = [
    {
      id: 1,
      title: "Modern Downtown Loft",
      price: 450000,
      location: "Downtown District",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      type: "Apartment",
      featured: true,
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
      type: "House",
      featured: true,
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
      type: "Studio",
      featured: false,
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Spacious Townhouse",
      price: 525000,
      location: "Riverside",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      type: "Townhouse",
      featured: false,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Executive Penthouse",
      price: 1200000,
      location: "City Center",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2200,
      type: "Penthouse",
      featured: true,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Garden View Condo",
      price: 375000,
      location: "Green Valley",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      type: "Condo",
      featured: false,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"
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
                  <SelectItem value="0-300000">0 - 300k</SelectItem>
                  <SelectItem value="300000-600000">300k - 600k</SelectItem>
                  <SelectItem value="600000-1000000">600k - 1M</SelectItem>
                  <SelectItem value="1000000+">1M+</SelectItem>
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
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-green-600 text-white">Featured</Badge>
                    )}
                    <Badge variant="secondary">{property.type}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                      ♡
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link to={`/listing/${property.id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 hover:text-green-600 transition-colors">
                      {property.title}
                    </h3>
                  </Link>
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
                    <span className="text-xl font-bold text-green-600">
                      Ksh {property.price.toLocaleString()}
                    </span>
                    <Link to={`/listing/${property.id}`}>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button className="bg-green-600 text-white">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Archive;
