import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, User as UserIcon, Phone, Mail, Home, DollarSign } from 'lucide-react';

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  propertiesListed: number;
  propertiesSold: number;
  totalSales: number;
  createdAt: string;
}

const AgentsReport = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/dashboard/agents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setAgents(res.data.data);
        }
      } catch (err) {
        setError('Failed to load agents. Please try again later.');
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents Performance Report</h1>
          <p className="text-gray-600 mt-2">Overview of all registered agents and their performance metrics.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Agents Overview</CardTitle>
                <CardDescription>
                  {loading ? 'Loading agent data...' : `Showing ${agents.length} agents`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500 text-center py-8">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : agents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Listed</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead className="text-right">Success Rate</TableHead>
                      <TableHead className="text-right">Total Sales</TableHead>
                      <TableHead>Member Since</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => {
                      const successRate = agent.propertiesListed > 0 
                        ? Math.round((agent.propertiesSold / agent.propertiesListed) * 100) 
                        : 0;
                      
                      return (
                        <TableRow key={agent._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{agent.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="h-3.5 w-3.5 mr-1" />
                                  {agent.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {agent.phone ? (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3.5 w-3.5 mr-1.5" />
                                {agent.phone}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">No phone</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center justify-end">
                              <Home className="h-4 w-4 mr-1.5 text-gray-500" />
                              {agent.propertiesListed}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {agent.propertiesSold}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              successRate > 50 ? 'bg-green-100 text-green-800' : 
                              successRate > 20 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {successRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center justify-end">
                              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                              {formatCurrency(agent.totalSales || 0)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(agent.createdAt)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  <UserIcon className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no registered agents in the system.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AgentsReport;