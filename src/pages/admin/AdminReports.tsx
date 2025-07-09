
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, TrendingUp, TrendingDown, Eye, DollarSign } from 'lucide-react';

const AdminReports = () => {
  const reportData = {
    totalRevenue: 2450000,
    propertiesSold: 89,
    activeListings: 156,
    pageViews: 45678,
    conversionRate: 12.5
  };

  const recentSales = [
    {
      id: 1,
      property: 'Modern Downtown Loft',
      price: 450000,
      agent: 'John Doe',
      date: '2024-01-20',
      commission: 22500,
      location: 'Nairobi, Westlands',
      buyer: 'Alice Johnson'
    },
    {
      id: 2,
      property: 'Family Maisonette',
      price: 750000,
      agent: 'Jane Smith',
      date: '2024-01-18',
      commission: 37500,
      location: 'Nairobi, Karen',
      buyer: 'Bob Wilson'
    },
    {
      id: 3,
      property: 'Luxury Bungalow',
      price: 1200000,
      agent: 'Mike Wilson',
      date: '2024-01-15',
      commission: 60000,
      location: 'Nairobi, Runda',
      buyer: 'Carol Davis'
    },
    {
      id: 4,
      property: 'City Apartment',
      price: 320000,
      agent: 'Sarah Brown',
      date: '2024-01-12',
      commission: 16000,
      location: 'Nairobi, CBD',
      buyer: 'David Miller'
    },
    {
      id: 5,
      property: 'Suburban House',
      price: 580000,
      agent: 'Tom Anderson',
      date: '2024-01-10',
      commission: 29000,
      location: 'Nairobi, Kileleshwa',
      buyer: 'Eva Martinez'
    }
  ];

  const topPerformers = [
    { name: 'Mike Wilson', sales: 15, revenue: 3200000 },
    { name: 'Jane Smith', sales: 12, revenue: 2800000 },
    { name: 'John Doe', sales: 10, revenue: 2100000 }
  ];

  const propertyViews = [
    { property: 'Luxury Villa Runda', views: 1245, inquiries: 23, conversion: '1.8%' },
    { property: 'Modern Apartment CBD', views: 987, inquiries: 18, conversion: '1.8%' },
    { property: 'Family Home Karen', views: 856, inquiries: 15, conversion: '1.8%' },
    { property: 'Studio Westlands', views: 743, inquiries: 12, conversion: '1.6%' },
    { property: 'Townhouse Lavington', views: 632, inquiries: 9, conversion: '1.4%' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Track performance and generate insights</p>
          </div>
          <Button className="bg-brand-green hover:bg-brand-green/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <span className="h-8 w-8 text-green-600">Ksh</span>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+15.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Properties Sold</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.propertiesSold}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+23.1%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-brand-green">{reportData.activeListings}</p>
                </div>
                <Eye className="h-8 w-8 text-brand-green" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8.7%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-purple-600">{reportData.pageViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">-2.1%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-brand-orange">{reportData.conversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-brand-orange" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.property}</TableCell>
                    <TableCell>{sale.location}</TableCell>
                    <TableCell className="font-bold text-green-600">Ksh {sale.price.toLocaleString()}</TableCell>
                    <TableCell>{sale.agent}</TableCell>
                    <TableCell>{sale.buyer}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="font-medium hidden">Ksh {sale.commission.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 hidden">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((performer, index) => (
                    <TableRow key={performer.name}>
                      <TableCell>
                        <Badge className="bg-brand-green/10 text-brand-green">
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{performer.name}</TableCell>
                      <TableCell>{performer.sales}</TableCell>
                      <TableCell className="font-bold">Ksh {performer.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Property Views Report */}
          <Card>
            <CardHeader>
              <CardTitle>Property Views & Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyViews.map((property, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{property.property}</TableCell>
                      <TableCell>{property.views.toLocaleString()}</TableCell>
                      <TableCell>{property.inquiries}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{property.conversion}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
