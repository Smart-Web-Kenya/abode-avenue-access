import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Calendar, CheckCircle2, Hourglass, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface Booking {
  _id: string;
  property: {
    _id: string;
    title: string;
    location: {
      city: string;
      country: string;
      subArea?: string;
    };
    images: Array<{ _id: string; url: string }>;
  };
  date: string;
  status: string;
  price: number;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get("http://127.0.0.1:3000/api/v1/sales/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setIsCancelling(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:3000/api/v1/sales/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to reflect the cancellation
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: "Cancelled" } : booking
      ));

      toast({
        title: "Success",
        description: "Your booking has been cancelled.",
      });
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="container mx-auto px-2 py-6 flex-1">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
            <Button onClick={() => navigate("/properties")}>
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking._id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={
                      booking.property.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=800&fit=crop"
                    }
                    alt={booking.property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold">
                      {booking.property.title}
                    </CardTitle>
                    <span className="text-lg font-bold text-brand-green">
                      Ksh. {booking.price?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-brand-green" />
                    <span>
                      {[booking.property.location?.subArea, 
                        booking.property.location?.city, 
                        booking.property.location?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-1 text-brand-green" />
                    <span>
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {booking.status}
                    </span>

                    {booking.status !== "Cancelled" && (
                      <Button
                        variant="ghost"
                        onClick={() => handleCancel(booking._id)}
                        disabled={isCancelling}
                        className="h-6 text-red-500 hover:bg-red-50"
                      >
                        {isCancelling ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <XCircle size={14} className="mr-1" />
                        )}
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;