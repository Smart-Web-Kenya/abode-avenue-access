
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Bath, Bed, Square, Calendar, Car, Wifi, Dumbbell, Shield, Trees, Play, Send } from 'lucide-react';
import Header from '@/components/Header';

const SingleListing = () => {
  const { id } = useParams();
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: ''
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', bookingForm);
    // Reset form
    setBookingForm({ name: '', email: '', phone: '', preferredDate: '' });
  };

  // Mock property data - in a real app, this would come from an API
  const property = {
    id: 1,
    title: "Modern Downtown Loft",
    price: 450000,
    location: "Downtown District, 123 Main Street",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "Apartment",
    yearBuilt: 2020,
    parking: 1,
    featured: true,
    description: "Experience urban luxury in this stunning downtown loft featuring floor-to-ceiling windows, hardwood floors, and modern finishes throughout. The open-concept design creates a seamless flow between the living, dining, and kitchen areas, perfect for entertaining. The gourmet kitchen boasts stainless steel appliances, quartz countertops, and custom cabinetry.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video URL
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
    ],
    amenities: [
      { name: "WiFi Included", icon: Wifi },
      { name: "Fitness Center", icon: Dumbbell },
      { name: "Secure Building", icon: Shield },
      { name: "Rooftop Garden", icon: Trees },
      { name: "Parking Space", icon: Car }
    ],
    agent: {
      name: "Sarah Johnson",
      email: "sarah@estatehub.com",
      phone: "+1 (555) 123-4567",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&crop=face"
    },
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
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
                      src={property.videoUrl}
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

            {/* Image Gallery Carousel */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Property Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {property.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <img
                              src={image}
                              alt={`${property.title} - Image ${index + 1}`}
                              className="w-full h-96 object-cover rounded-lg"
                            />
                          </div>
                        </CarouselItem>
                      ))}
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
                      ${property.price.toLocaleString()}
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
                    <div className="text-2xl font-semibold">{property.yearBuilt}</div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <amenity.icon className="h-5 w-5 text-brand-green" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Google Maps */}
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

            {/* Contact Agent Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                  <p className="text-gray-600 text-sm">Licensed Real Estate Agent</p>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white">
                    Schedule Viewing
                  </Button>
                  <Button variant="outline" className="w-full">
                    Call: {property.agent.phone}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Email Agent
                  </Button>
                </div>
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
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Spaces:</span>
                    <span className="font-medium">{property.parking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per sq ft:</span>
                    <span className="font-medium">${Math.round(property.price / property.sqft)}</span>
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
