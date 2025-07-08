
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      commission: 22500
    },
    {
      id: 2,
      property: 'Family Maisonette',
      price: 750000,
      agent: 'Jane Smith',
      date: '2024-01-18',
      commission: 37500
    },
    {
      id: 3,
      property: 'Luxury Bungalow',
      price: 1200000,
      agent: 'Mike Wilson',
      date: '2024-01-15',
      commission: 60000
    }
  ];

  const topPerformers = [
    { name: 'Mike Wilson', sales: 15, revenue: 3200000 },
    { name: 'Jane Smith', sales: 12, revenue: 2800000 },
    { name: 'John Doe', sales: 10, revenue: 2100000 }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Track performance and generate insights</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700">
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
                    ${reportData.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
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
                  <p className="text-2xl font-bold text-blue-600">{reportData.propertiesSold}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
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
                  <p className="text-2xl font-bold text-teal-600">{reportData.activeListings}</p>
                </div>
                <Eye className="h-8 w-8 text-teal-600" />
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
                  <p className="text-2xl font-bold text-orange-600">{reportData.conversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{sale.property}</p>
                      <p className="text-sm text-gray-500">Sold by {sale.agent} on {sale.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${sale.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Commission: ${sale.commission.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-teal-100 text-teal-800">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-gray-500">{performer.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${performer.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Sales charts would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
