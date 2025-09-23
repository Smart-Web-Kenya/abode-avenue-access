import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart2, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PropertyStats {
  _id: string;
  title: string;
  views: number;
  inquiries: number;
  status: 'Available' | 'Pending' | 'Sold' | 'Rented';
  createdAt: string;
  updatedAt: string;
}

const ViewsReport = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PropertyStats[]>([]);
  const [summary, setSummary] = useState({
    totalViews: 0,
    totalInquiries: 0,
    avgConversion: 0,
    lastUpdated: new Date(),
  });
  const [error, setError] = useState<string | null>(null);

  const fetchPropertyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Fetch properties with views and inquiries
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property statistics');
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.properties || []);
        
        // Calculate summary stats
        const totalViews = data.data.properties.reduce((sum: number, prop: PropertyStats) => sum + (prop.views || 0), 0);
        const totalInquiries = data.data.properties.reduce((sum: number, prop: PropertyStats) => sum + (prop.inquiries || 0), 0);
        const avgConversion = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;
        
        setSummary({
          totalViews,
          totalInquiries,
          avgConversion: parseFloat(avgConversion.toFixed(2)),
          lastUpdated: new Date(),
        });
      }
    } catch (err) {
      console.error('Error fetching property stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load property statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyStats();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'Available': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Sold': 'bg-red-100 text-red-800',
      'Rented': 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  if (loading && stats.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-red-500">{error}</div>
          <Button onClick={fetchPropertyStats} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Property Analytics</h1>
            <p className="text-muted-foreground">
              Track views, inquiries, and conversion rates for all properties
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={fetchPropertyStats} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-xs text-muted-foreground">
              Updated {formatDate(summary.lastUpdated.toString())}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.length}</div>
              <p className="text-xs text-muted-foreground">All active listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All-time property views</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalInquiries}</div>
              <p className="text-xs text-muted-foreground">Customer inquiries received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgConversion}%</div>
              <p className="text-xs text-muted-foreground">Views to inquiries</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>
              Detailed view of each property's performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Inquiries</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.length > 0 ? (
                  stats.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell className="text-right">{property.views?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">{property.inquiries || 0}</TableCell>
                      <TableCell className="text-right">
                        {property.views > 0 
                          ? `${((property.inquiries / property.views) * 100).toFixed(2)}%` 
                          : '0%'}
                      </TableCell>
                      <TableCell>{formatDate(property.updatedAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No property data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewsReport;