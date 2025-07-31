import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Bath, Bed, Square, Calendar, Car, Wifi, Dumbbell, Shield, Trees, Play, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useProperty } from '@/hooks/useProperties';

const SingleListing = () => {
  const { id } = useParams<{ id: string }>();
  const { property, loading, error } = useProperty(id || '');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: ''
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingForm);
    setBookingForm({ name: '', email: '', phone: '', preferredDate: '' });
  };

  // Icon mapping for amenities
  const amenityIcons: { [key: string]: any } = {
    'WiFi Included': Wifi,
    'Fitness Center': Dumbbell,
    'Secure Building': Shield,
    'Rooftop Garden': Trees,
    'Parking Space': Car,
    'Gym': Dumbbell,
    'Security': Shield,
    'Swimming Pool': Trees // Using Trees as a fallback, you can add more icons as needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
            <p className="ml-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/archive">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white">
                Browse All Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock agent data (you can extend the database later to include agent information)
  const agent = {
    name: "Sarah Johnson",
    email: "sarah@estatehub.com",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&crop=face"
  };

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
            {/* Property Video */}
            {property.video_url && (
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
                        src={property.video_url}
                        title="Property Video Tour"
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Image Gallery Carousel */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Property Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {property.images && Array.isArray(property.images) && property.images.length > 0 ? (
                        property.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <img
                                src={image}
                                alt={`${property.title} - Image ${index + 1}`}
                                className="w-full h-96 object-cover rounded-lg"
                              />
                            </div>
                          </CarouselItem>
                        ))
                      ) : (
                        <CarouselItem>
                          <div className="p-1">
                            <img
                              src={property.image_url || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop"}
                              alt={property.title}
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
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-brand-green mb-2">
                      ${Number(property.price).toLocaleString()}
                    </div>
                    {property.featured && (
                      <Badge className="bg-brand-green text-white">Featured</Badge>
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
                    <div className="text-2xl font-semibold">{property.year_built || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description || 'No description available for this property.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => {
                      const IconComponent = amenityIcons[amenity] || Shield;
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-brand-green" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Google Maps */}
            {property.coordinates && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5273!2d${property.coordinates.lng}!3d${property.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDBCeDEyJzEwLjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890123`}
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
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
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

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <img
                    src={property.agent_image || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&crop=face"}
                    alt={property.agent_name || "Agent"}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-lg">{property.agent_name || "Real Estate Agent"}</h3>
                  <p className="text-gray-600 text-sm">Licensed Real Estate Agent</p>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white">
                    Schedule Viewing
                  </Button>
                  {property.agent_phone && (
                    <Button variant="outline" className="w-full">
                      Call: {property.agent_phone}
                    </Button>
                  )}
                  {property.agent_email && (
                    <Button variant="outline" className="w-full">
                      Email Agent
                    </Button>
                  )}
                  {property.contact_whatsapp && (
                    <Button variant="outline" className="w-full bg-green-50 hover:bg-green-100">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp: {property.contact_whatsapp}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{property.contact_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{property.contact_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{property.contact_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.year_built || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Spaces:</span>
                    <span className="font-medium">{property.parking_spaces || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per sq ft:</span>
                    <span className="font-medium">${Math.round(Number(property.price) / property.sqft)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListing;
