import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Users, TrendingUp, FileText } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { UserRound } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  images: Array<{ url: string }>;
  agent: { name: string };
  createdAt: string;
}

interface Buyer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  property: {
    _id: string;
    title: string;
    price?: number;
  };
  saleDate?: string;
  amount?: number;
  status?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeUsers: 0,
    propertiesSold: 0,
    totalBuyers: 0,
  });
  
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [recentBuyers, setRecentBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    properties: true,
    buyers: true
  });
  const [error, setError] = useState({
    stats: null,
    properties: null,
    buyers: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:3000/api/v1/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        setError(prev => ({ ...prev, stats: 'Failed to load dashboard statistics' }));
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:3000/api/v1/dashboard/recent-properties', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setRecentProperties(res.data.data);
        }
      } catch (err) {
        setError(prev => ({ ...prev, properties: 'Failed to load recent properties' }));
        console.error('Error fetching recent properties:', err);
      } finally {
        setLoading(prev => ({ ...prev, properties: false }));
      }
    };

    fetchRecentProperties();
  }, []);

  useEffect(() => {
    const fetchRecentBuyers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:3000/api/v1/dashboard/recent-buyers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setRecentBuyers(res.data.data);
        }
      } catch (err) {
        setError(prev => ({ ...prev, buyers: 'Failed to load recent buyers' }));
        console.error('Error fetching recent buyers:', err);
      } finally {
        setLoading(prev => ({ ...prev, buyers: false }));
      }
    };

    fetchRecentBuyers();
  }, []);

  const statsConfig = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building,
      color: 'text-teal-600',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Properties Sold',
      value: stats.propertiesSold,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Inquiries',
      value: stats.totalBuyers,
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your properties.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="font-semibold">{stat.title}</span>
              </CardHeader>
              <CardContent>
                {loading.stats ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin border-2 border-gray-500 rounded-full"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{stat.value}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Properties Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
              <CardDescription>
                {loading.properties ? 'Loading...' : `Showing ${recentProperties.length} most recent properties`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error.properties ? (
                <div className="text-red-500 text-center py-4">{error.properties}</div>
              ) : loading.properties ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin border-2 border-gray-500 rounded-full"></div>
                </div>
              ) : recentProperties.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentProperties.map((property) => (
                        <TableRow key={property._id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>Ksh. {property.price?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              property.status === 'sold' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {property.status || 'Available'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No properties found
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Buyers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Buyers</CardTitle>
              <CardDescription>
                {loading.buyers ? 'Loading...' : `Showing ${recentBuyers.length} most recent buyers`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error.buyers ? (
                <div className="text-red-500 text-center py-4">{error.buyers}</div>
              ) : loading.buyers ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin border-2 border-gray-500 rounded-full"></div>
                </div>
              ) : recentBuyers.length > 0 ? (
                <div className="space-y-4">
                  {recentBuyers.map((buyer) => (
                    <div key={buyer._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{buyer.name || 'Unknown Buyer'}</h3>
                          <p className="text-sm text-gray-600">{buyer.email || 'No email'}</p>
                          {buyer.phone && (
                            <p className="text-sm text-gray-600">{buyer.phone}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {buyer.saleDate ? new Date(buyer.saleDate).toLocaleDateString() : 'Date not available'}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm font-medium">{buyer.property?.title || 'Property not found'}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">
                            Ksh. {buyer.amount ? buyer.amount.toLocaleString() : 'N/A'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            buyer.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {buyer.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent buyers found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
