import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Bath, Bed, Square, Calendar, Car, Wifi, Dumbbell, Shield, Trees, Play, Send, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getCurrentUserFromStorage } from '@/services/authService';
import { getCurrentUser, type User } from '@/services/userService';

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

interface ApiCategoryPopulated {
  name: string;
  type: string;
}

interface ApiProperty {
  _id: string;
  title: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt?: number;
  location?: ApiLocation;
  images: ApiPropertyImage[];
  category?: ApiCategoryPopulated | string;
  status?: string;
  active?: boolean;
  amenities?: string[];
  video360Url?: string;
  contactPhones?: string[];
  views?: number;
}

const SingleListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: ''
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`http://127.0.0.1:3000/api/v1/properties/${id}`);
        setProperty(res.data?.data || null);
      } catch (err: any) {
        console.error('Failed to load property', err);
        setError('Failed to load property.');
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Load current user (from storage first, then API if needed)
  useEffect(() => {
    const userFromStorage = getCurrentUserFromStorage();
    if (userFromStorage) {
      setCurrentUser(userFromStorage);
      return;
    }
    (async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUser(res.data);
      } catch (e) {
        // Not logged in or failed to fetch; ignore silently
        setCurrentUser(null);
      }
    })();
  }, []);

  // Populate booking form defaults when property and/or user data is available
  useEffect(() => {
    if (!property && !currentUser) return;
    setBookingForm((prev) => ({
      name: prev.name || currentUser?.name || '',
      email: prev.email || currentUser?.email || '',
      phone: prev.phone || currentUser?.phone || property?.contactPhones?.[0] || '',
      preferredDate: prev.preferredDate || new Date().toISOString().slice(0, 10),
    }));
  }, [property, currentUser]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/booking-confirmation", {
      state: { bookingForm, property },
    });
  };

  const buildImageUrl = (prop: ApiProperty, img: ApiPropertyImage) =>
    `http://127.0.0.1:3000/api/v1/properties/${prop._id}/image/${img._id}`;

  const buildMapSrc = (prop: ApiProperty) => {
    const parts = [
      prop.location?.subArea,
      prop.location?.area,
      prop.location?.city,
      prop.location?.country,
    ].filter(Boolean);
    const query = encodeURIComponent(parts.join(', '));
    return `https://www.google.com/maps?q=${query}&output=embed`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-64 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-8 w-64 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="aspect-video bg-gray-100 rounded-lg animate-pulse"></div>
              </div>

              {/* Gallery Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-8 w-64 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="aspect-video bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 w-16 bg-gray-100 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Details Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="h-8 w-64 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-10 w-32 bg-brand-green/20 rounded-md animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-8 w-8 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-1/2 mx-auto mt-1 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 w-1/4 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Booking Form Skeleton */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-8 w-48 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 w-20 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-100 rounded-md animate-pulse"></div>
                      </div>
                    ))}
                    <div className="h-10 w-full bg-brand-green/20 rounded-md animate-pulse mt-4"></div>
                  </div>
                </div>

                {/* Summary Skeleton */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-8 w-48 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Property not found.</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-green">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/archive" className="hover:text-brand-green">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Video (always shown; uses API video if available, otherwise default) */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-brand-orange" />
                    Property Video Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                      loading="lazy"
                      src={property.video360Url || "https://my.matterport.com/show/?m=jm5WwEA3HUN&log=0&help=0&nt=0&play=1&qs=0&brand=1&dh=1&tour=1&gt=1&hr=1&mls=0&mt=1&tagNav=1&pin=1&portal=1&f=1&fp=1&nozoom=0&search=1&wh=0&kb=1&lp=0&title=1&tourcta=1&vr=1&title=0"}
                      title="Property Video"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Gallery Carousel */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Property Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {(property.images && property.images.length > 0
                        ? property.images
                        : ([] as ApiPropertyImage[])
                      ).map((img, index) => (
                        <CarouselItem key={img._id || index}>
                          <div className="p-1">
                            <img
                              src={buildImageUrl(property, img)}
                              alt={`${property.title} - Image ${index + 1}`}
                              className="w-full h-96 object-cover rounded-lg"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                      {(!property.images || property.images.length === 0) && (
                        <CarouselItem>
                          <div className="p-1">
                            <img
                              src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=800&fit=crop"
                              alt="Placeholder"
                              className="w-full h-96 object-cover rounded-lg"
                            />
                          </div>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            </div>

            {/* Property Details */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>
                        {property.location?.subArea || property.location?.area || property.location?.city || property.location?.country || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-brand-green mb-2">
                      Ksh.{property.price.toLocaleString()}
                    </div>
                    {property.status && (
                      <Badge className="bg-brand-green text-white">{property.status}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-brand-green" />
                    <div className="text-2xl font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-brand-green" />
                    <div className="text-2xl font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="h-8 w-8 mx-auto mb-2 text-brand-green" />
                    <div className="text-2xl font-semibold">{property.sqft}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-brand-green" />
                    <div className="text-2xl font-semibold">{property.yearBuilt ?? '—'}</div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{property.views || 0} views</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description || 'No description available.'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Wifi className="h-5 w-5 text-brand-green" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video">
                  <iframe
                    src={buildMapSrc(property)}
                    className="w-full h-full rounded-lg"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Form */}
            <Card className="mb-6 sticky top-4">
              <CardHeader>
                <CardTitle>Book a Viewing</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      required
                      placeholder={currentUser?.name || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      required
                      placeholder={currentUser?.email || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      required
                      placeholder={currentUser?.phone || property.contactPhones?.[0] || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Book Viewing
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Property Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{typeof property.category === 'object' ? property.category?.type : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.yearBuilt ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per sq ft:</span>
                    <span className="font-medium">Ksh.{property.sqft ? Math.round(property.price / property.sqft) : '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SingleListing;
