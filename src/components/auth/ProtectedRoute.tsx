import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string | string[];
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
}

/**
 * A component that protects routes based on authentication and roles.
 * 
 * @param children - The child components to render if authenticated and authorized
 * @param requiredRoles - Optional role or array of roles required to access the route
 * @param redirectTo - Path to redirect to if not authenticated (default: '/signin')
 * @param unauthorizedRedirectTo - Path to redirect to if not authorized (default: '/')
 */
export default function ProtectedRoute({ 
  children, 
  requiredRoles, 
  redirectTo = '/signin',
  unauthorizedRedirectTo = '/'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to login with the return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

 // If roles are required, check if user has any of the required roles
if (requiredRoles && user) {
    const normalizedRole = user.role?.toLowerCase();
  
    const hasRequiredRole = Array.isArray(requiredRoles)
      ? requiredRoles.some(role => normalizedRole === role.toLowerCase())
      : normalizedRole === (requiredRoles as string).toLowerCase();
  
    if (!hasRequiredRole) {
      console.log(`User with role ${user.role} is not authorized for this route`);
      return <Navigate to={unauthorizedRedirectTo} replace />;
    }
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}

// A higher-order component for protecting admin routes.
// Only users with 'admin' role can access these routes.
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles="admin" unauthorizedRedirectTo="/">
      {children}
    </ProtectedRoute>
  );
}

// A higher-order component for protecting agent routes.
// Only users with 'agent' or 'admin' role can access these routes.
export function AgentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['agent', 'admin']} unauthorizedRedirectTo="/">
      {children}
    </ProtectedRoute>
  );
}
