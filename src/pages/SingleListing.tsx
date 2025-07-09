
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Bath, Bed, Square, Calendar, Car, Wifi, Dumbbell, Shield, Trees } from 'lucide-react';
import Header from '@/components/Header';

const SingleListing = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      name: "Josh Minga",
      email: "joshlminga@meritafricahomes.com",
      phone: "+254 708 549 604",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&crop=face"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/archive" className="hover:text-green-600">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? 'border-green-600' : 'border-white'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      Ksh {property.price.toLocaleString()}
                    </div>
                    {property.featured && (
                      <Badge className="bg-green-600 text-white">Featured</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-semibold">{property.sqft}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
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
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <amenity.icon className="h-5 w-5 text-green-600" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Agent Card */}
            <Card className="mb-6 sticky top-4">
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
                  <Button className="w-full bg-green-600 hover:bg-green-700">
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
                  <div className="flex justify-between hidden">
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
