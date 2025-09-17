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

  const handleConfirm = () => {
    // 🔥 Call your API here to save the booking
    console.log("Final booking confirmed:", booking, property);

    // Show success modal
    setShowSuccess(true);
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
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
              >
                Book Now
              </Button>

              <Link to={`/property/${property?._id}`}>
                <Button variant="outline" className="border-gray-300 text-gray-600">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Success Modal */}
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

      {/* ✨ Tailwind keyframes for smooth animation */}
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
