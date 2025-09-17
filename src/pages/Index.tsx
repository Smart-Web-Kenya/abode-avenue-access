import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Bath, Bed, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import TrackRecord from '@/components/TrackRecord';
import PartnersAwards from '@/components/PartnersAwards';
import FAQ from '@/components/FAQ';
import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';
import axios from 'axios';

interface ApiPropertyImage {
  _id: string;
  mimetype: string;
  isFeatured?: boolean;
}

interface ApiProperty {
  _id: string;
  title: string;
  price: number;
  location?: { city?: string; area?: string; country?: string };
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: ApiPropertyImage[];
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featured, setFeatured] = useState<ApiProperty[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);

  const heroImages = [
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Fetch latest 3 featured properties
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoadingFeatured(true);
        const res = await axios.get('http://127.0.0.1:3000/api/v1/properties/featured');
        setFeatured(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error('Failed to load featured properties', err);
        setFeatured([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const featuredImageUrl = (p: ApiProperty) => {
    if (!p.images || p.images.length === 0) return 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=600&fit=crop';
    const img = p.images.find(i => i.isFeatured) || p.images[0];
    return `http://127.0.0.1:3000/api/v1/properties/${p._id}/image/${img._id}`;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Enhanced Hero Section with Image Slider */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Link to="/archive" className="block w-full h-full">
                <img
                  src={image}
                  alt={`Hero slide ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </Link>
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl">
            {/* Animated Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Explore Our{' '}
              <span className="text-brand-orange animate-pulse">Awesome</span>{' '}
              Properties
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
              Discover the perfect property from our curated collection of premium homes and apartments
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-4 shadow-lg mb-8 animate-scale-in">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter location, property type, or keyword..."
                    className="pl-10 border-0 text-gray-900 focus:ring-2 focus:ring-brand-green"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link to="/archive">
                  <Button className="bg-brand-green hover:bg-brand-green/90 text-white px-8">
                    Search
                  </Button>
                </Link>
              </div>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap animate-fade-in">
              <Link to="/archive">
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 text-lg">
                  View Listings
                </Button>
              </Link>
              <Link to="/archive">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
                  Book a Viewing
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
            {isLoadingFeatured && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={`sk-${i}`} className="overflow-hidden rounded-md border bg-white">
                    <div className="h-64 w-full bg-gray-200 animate-pulse" />
                    <div className="p-6 space-y-4">
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
                        <div className="h-9 w-28 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoadingFeatured && featured.length === 0 && (
              <div className="col-span-3 text-center text-gray-600">No properties available yet.</div>
            )}
            {!isLoadingFeatured && featured.map((property) => (
              <Link key={property._id} to={`/listing/${property._id}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative">
                    <img
                      src={featuredImageUrl(property)}
                      alt={property.title}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-brand-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {property.location?.area || property.location?.city || property.location?.country || '—'}
                      </span>
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
                      <span className="text-2xl font-bold text-brand-green">
                        ${property.price.toLocaleString()}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/archive">
              <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Track Record Section */}
      <TrackRecord />

      {/* Partners & Awards Section */}
      <PartnersAwards />

      {/* About Us Section */}
      <AboutUs />

      {/* FAQs Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your New Home?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/signup">
              <Button size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white">
                Get Started
              </Button>
            </Link>
            <Link to="/archive">
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
