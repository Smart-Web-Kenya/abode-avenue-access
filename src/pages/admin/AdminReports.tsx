import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const AdminReports = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeListingsCount, setActiveListingsCount] = useState<number>(0);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(sales.length / rowsPerPage);

  useEffect(() => {
    const fetchActiveListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Get the count of active properties from the dashboard stats
        setActiveListingsCount(res.data.data?.activeProperties || 0);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setActiveListingsCount(0);
      }
    };
    
    fetchActiveListings();

    const fetchSales = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sales/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSales(res.data.data || []);
      } catch (err) {
        setSales([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
    fetchActiveListings();
  }, []);

  const handleStatusChange = async (saleId: string, newStatus: string) => {
    setUpdatingId(saleId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/sales/${saleId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSales((prev) =>
        prev.map((sale) =>
          sale._id === saleId ? { ...sale, status: newStatus } : sale
        )
      );
    } catch (err) {
      // Optionally show error
    } finally {
      setUpdatingId(null);
    }
  };

  const paginatedSales = sales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Track performance and generate insights</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    Ksh.{sales.reduce((sum, s) => sum + Number(s.price || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Properties Sold</p>
                  <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-brand-green">{activeListingsCount}</p>
                </div>
                <Eye className="h-8 w-8 text-brand-green" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-purple-600">-</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-brand-orange">-</p>
                </div>
                <TrendingUp className="h-8 w-8 text-brand-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales Table with Pagination */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-gray-500">Loading sales...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell className="font-medium">{sale.propertyDetails?.title || '-'}</TableCell>
                        <TableCell>{sale.propertyDetails?.location || '-'}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          Ksh.{Number(sale.price || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>{sale.agentDetails?.name || '-'}</TableCell>
                        <TableCell>{sale.buyer?.name || '-'}</TableCell>
                        <TableCell>
                          {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          Ksh.{Number(sale.commission || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <select
                            value={sale.status}
                            disabled={updatingId === sale._id}
                            onChange={(e) => handleStatusChange(sale._id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs border ${
                              sale.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : sale.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination Controls */}
                <div className="flex justify-end items-center mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
