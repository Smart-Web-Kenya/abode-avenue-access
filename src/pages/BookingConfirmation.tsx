import { useState } from "react";
import { MapPin, Bed, Bath, Square, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.bookingForm;
  const property = location.state?.property;

  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Get the current user and token from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      // Check if user is logged in and has a valid token
      if (!user?.id || !token) {
        // Redirect to login if not authenticated
        navigate('/signin', { 
          state: { 
            from: location.pathname,
            message: 'Please login to complete your booking' 
          } 
        });
        return;
      }
      
      // Check if property has an agent
      if (!property?.agent_id) {
        throw new Error('This property is not assigned to any agent. Please contact support.');
      }
      
      // Prepare the sale data
      const saleData = {
        property: property?._id,
        propertyDetails: {
          title: property?.title,
          location: [
            property?.location?.subArea,
            property?.location?.city,
            property?.location?.country
          ].filter(Boolean).join(', '),
          image: property?.images?.[0]?._id
        },
        price: property?.price,
        agent: property.agent_id,
        buyer: {
          name: user?.name || 'Guest User',
          email: user?.email,
          phone: user?.phone || 'Not provided',
          id: user.id
        },
        date: booking?.preferredDate || new Date().toISOString(),
        commission: 0,
        createdBy: user.id,
        status: 'pending'
      };

      // Make the API call to save the sale
      const response = await fetch('http://127.0.0.1:3000/api/v1/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Failed to save booking: ${response.status} ${response.statusText}`
        );
      }

      // Show success modal if everything went well
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving booking:', error);
      
      // Handle token expiration or invalid token
      if (error.message.includes('token') || error.message.includes('401')) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Your session has expired. Please login again.' 
          } 
        });
      } else {
        // Show other errors to the user
        alert(error.message || 'Failed to save booking. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 text-center">
              Confirm Your Booking
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Property Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <img
                src={
                  property?.images?.length
                    ? `http://127.0.0.1:3000/api/v1/properties/${property._id}/image/${property.images[0]._id}`
                    : "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=800&fit=crop"
                }
                alt={property?.title}
                className="w-full h-64 object-cover rounded-lg shadow-sm"
              />

              <div className="space-y-3">
                <h2 className="text-lg font-semibold">{property?.title}</h2>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-brand-green" />
                  <span>
                    {property?.location?.subArea ||
                      property?.location?.city ||
                      property?.location?.country}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-brand-green" />
                    {property?.bedrooms} Beds
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-brand-green" />
                    {property?.bathrooms} Baths
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-brand-green" />
                    {property?.sqft} Sq Ft
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-green" />
                    {property?.yearBuilt ?? "—"}
                  </div>
                </div>

                <p className="text-xl font-bold text-brand-green">
                  Ksh.{property?.price?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Confirmation Text */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-700 font-medium">
                Are you sure you want to book a viewing for this property on{" "}
                <span className="text-brand-orange font-semibold">
                  {booking?.preferredDate}
                </span>
                ?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleConfirm}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Book Now'
                )}
              </Button>

              <Link to={`/archive`}>
                <Button variant="outline" className="border-gray-300 text-gray-600">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center animate-scaleIn w-[90%] max-w-md">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-green-600">Booking Successful!</h2>
            <p className="text-gray-600 mt-2 mb-6">We’ve saved your booking details.</p>

            {/* Action buttons inside modal */}
            <div className="flex gap-4 w-full">
              <Button
                onClick={() => {
                    setShowSuccess(false);
                    navigate("/");
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600"

              >
                Go Back
              </Button>
              <Button
                onClick={() => navigate("/my-bookings")}
                className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white"
              >
                View My Bookings
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Tailwind keyframes for smooth animation */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
