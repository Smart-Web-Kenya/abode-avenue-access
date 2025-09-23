import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Bath, Bed, Square, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';

interface ApiPropertyImage {
  _id: string;
  mimetype: string;
  isFeatured?: boolean;
}

interface ApiLocation {
  country?: string;
  city?: string;
  area?: string;
  subArea?: string;
}

interface ApiProperty {
  _id: string;
  title: string;
  price: number;
  location?: ApiLocation;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: ApiPropertyImage[];
  category?: { name: string; type: string } | string;
  status?: string;
  active?: boolean;
}

const Archive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/properties`);
        setProperties(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error('Failed to load properties', err);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const imageUrl = (p: ApiProperty) => {
    if (!p.images || p.images.length === 0) return 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=600&fit=crop';
    const img = p.images.find(i => i.isFeatured) || p.images[0];
    return `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/${p._id}/image/${img._id}`;
  };

  // Basic client-side filtering (optional)
  const filtered = properties.filter(p => {
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location?.area || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBeds = !bedrooms || p.bedrooms >= parseInt(bedrooms, 10);

    // Simple price-range parser like "300000-600000" or "1000000+"
    let matchesPrice = true;
    if (priceRange) {
      if (priceRange.endsWith('+')) {
        const min = parseInt(priceRange.replace('+', ''), 10);
        matchesPrice = p.price >= min;
      } else {
        const [minS, maxS] = priceRange.split('-');
        const min = parseInt(minS, 10);
        const max = parseInt(maxS, 10);
        matchesPrice = p.price >= min && p.price <= max;
      }
    }

    const matchesType = !propertyType || (typeof p.category === 'object' && p.category?.type?.toLowerCase() === propertyType.toLowerCase());

    return matchesSearch && matchesBeds && matchesPrice && matchesType;
  });

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
              {isLoading ? 'Loading properties...' : `${filtered.length} Properties Found`}
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
            {isLoading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={`sk-${i}`} className="overflow-hidden rounded-md border bg-white">
                    <div className="h-48 w-full bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-4 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoading && filtered.map((property) => (
              <Link key={property._id} to={`/listing/${property._id}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl(property)}
                      alt={property.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {/* Optionally display status/category */}
                      {property.status && (
                        <Badge className="bg-blue-600 text-white">{property.status}</Badge>
                      )}
                      {typeof property.category === 'object' && property.category?.name && (
                        <Badge variant="secondary">{property.category.name}</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {[
                          property.location?.area,
                          property.location?.city,
                          property.location?.country
                        ].filter(Boolean).join(', ') || '—'}
                      </span>
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
                      <span className="text-xl font-bold text-blue-600">
                        Ksh.{property.price.toLocaleString()}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-brand-green hover:bg-brand-green/90 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Pagination (placeholder) */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white">1</Button>
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
