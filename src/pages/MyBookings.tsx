import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Calendar, CheckCircle2, Hourglass, XCircle, Loader2, ArrowRight, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Property {
  _id: string;
  title: string;
  location: {
    city: string;
    country: string;
    subArea?: string;
  };
  images: Array<{ _id: string; url: string }>;
  price: number;
}

interface Booking {
  _id: string;
  property: Property | string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  agent?: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login", { state: { from: "/my-bookings" } });
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/sales/my-bookings`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { 
              state: { 
                from: '/my-bookings',
                message: 'Your session has expired. Please login again.'
              } 
            });
            return;
          }
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        if (data.success) {
          setBookings(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to load bookings');
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, toast]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setIsCancelling(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/sales/${bookingId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Update the local state to reflect the cancellation
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Hourglass className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'Invalid date' 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2">Loading your bookings...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your property bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-gray-500">You haven't made any bookings yet.</p>
            <div className="mt-6">
              <Button onClick={() => navigate('/properties')}>
                Browse Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {typeof booking.property === 'object' ? booking.property.title : 'Property'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {formatDate(booking.date)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {typeof booking.property === 'object' && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                        {[
                          booking.property.location.subArea,
                          booking.property.location.city,
                          booking.property.location.country
                        ].filter(Boolean).join(', ')}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(booking.price)}
                      </div>
                    </div>
                  )}
                  {booking.agent && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Agent</p>
                      <p className="text-sm text-gray-600">{booking.agent.name}</p>
                      <p className="text-sm text-gray-500">{booking.agent.email}</p>
                      {booking.agent.phone && (
                        <p className="text-sm text-gray-500">{booking.agent.phone}</p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/properties/${typeof booking.property === 'object' ? booking.property._id : ''}`)}
                  >
                    View Property
                  </Button>
                  {booking.status.toLowerCase() === 'pending' && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleCancel(booking._id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;