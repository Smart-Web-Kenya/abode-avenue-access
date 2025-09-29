import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Archive from "./pages/Archive";
import SingleListing from "./pages/SingleListing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminAmenities from "./pages/admin/AdminAmenities";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminCategories from "./pages/admin/AdminCategories";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import SalesReport from "./pages/admin/reports/SalesReport";
import AgentsReport from "./pages/admin/reports/AgentsReport";
import ViewsReport from "./pages/admin/reports/ViewsReport";
import Blogs from './pages/admin/Blogs'

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role !== 'admin' && user?.role !== 'agent') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/listing/:id" element={<SingleListing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/properties" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminProperties />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports/sales" element={<Navigate to="/admin/reports" replace />} />
            <Route path="/admin/reports/agents" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AgentsReport />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports/views" element={
              <ProtectedRoute>
                <AdminRoute>
                  <ViewsReport />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/amenities" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminAmenities />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/locations" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLocations />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/categories" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/blogs" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Blogs />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
