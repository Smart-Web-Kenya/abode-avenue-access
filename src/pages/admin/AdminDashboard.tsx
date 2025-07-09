
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Properties',
      value: '156',
      change: '+12%',
      icon: Building,
      color: 'text-teal-600',
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8%',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Properties Sold',
      value: '89',
      change: '+23%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Inquiries',
      value: '2,456',
      change: '+15%',
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
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-medium">Modern Downtown Apartment</p>
                      <p className="text-sm text-gray-500">Added 2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">450,000</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">Interested in Downtown Loft</p>
                    </div>
                    <div className="text-sm text-gray-500">2h ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
