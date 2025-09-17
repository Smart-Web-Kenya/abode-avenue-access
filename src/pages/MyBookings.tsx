import { useLocation } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Calendar, CheckCircle2, Hourglass, XCircle } from "lucide-react";

const myBookings = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: { city: "Mombasa", country: "Kenya" },
    date: "2025-09-20",
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=800&fit=crop",
  },
  {
    id: 2,
    title: "Nairobi City Apartment",
    location: { city: "Nairobi", country: "Kenya" },
    date: "2025-09-25",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=800&fit=crop",
  },
  {
    id: 3,
    title: "Mountain Retreat Cabin",
    location: { city: "Nakuru", country: "Kenya" },
    date: "2025-10-10",
    status: "Cancelled",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=800&fit=crop",
  },
];

const MyBookings = () => {
  const handleCancel = (id: number) => {
    console.log("Cancel booking:", id);
    // 🔥 Call your API here to cancel the booking
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="container mx-auto px-2 py-6 flex-1">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
          My Bookings
        </h1>

        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {myBookings.map((booking) => (
            <Card
              key={booking.id}
              className="border border-gray-200 rounded-lg overflow-hidden flex items-center transition-shadow hover:shadow-sm"
            >
              {/* Compact Image */}
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details & Actions */}
              <CardContent className="p-3 flex-1 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-sm">
                  <CardTitle className="text-base font-semibold text-gray-800 line-clamp-1">
                    {booking.title}
                  </CardTitle>
                  <div className="flex items-center text-gray-500 text-xs">
                    <MapPin size={12} className="mr-1 text-gray-400" />
                    <span className="line-clamp-1">{booking.location.city}, {booking.location.country}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar size={12} className="mr-1 text-gray-400" />
                    <span className="font-medium">{booking.date}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    booking.status === "Confirmed" ? "bg-green-100 text-green-700" :
                    booking.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {booking.status}
                  </span>

                  {/* Cancel Button */}
                  {booking.status !== "Cancelled" && (
                    <Button
                      variant="ghost"
                   
                      onClick={() => handleCancel(booking.id)}
                      className="h-6 text-red-500 hover:bg-red-50"
                    >
                      <XCircle size={14} className="mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;