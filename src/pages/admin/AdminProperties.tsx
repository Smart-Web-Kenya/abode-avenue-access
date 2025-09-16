import { useState, useEffect } from 'react';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import PropertyForm from '@/components/admin/PropertyForm';

const AdminProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Fetch properties from API
  const fetchProperties = async (search = '', page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await api.get('/properties', {
        params: {
          sort: '-createdAt',
          search: search || undefined,
          page,
          limit
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.data && response.data.success) {
        const propertiesData = response.data.data || [];
        const totalCount = response.data.count || 0;

        setProperties(propertiesData);
        setPagination({
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit) || 1
        });
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error in fetchProperties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(searchTerm, 1, pagination.limit);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchProperties('', pagination.page, pagination.limit);
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800',
      'Sold': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (property: any) => {
    setSelectedProperty(property);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await api.delete(`/properties/${propertyId}`);
      fetchProperties(searchTerm, pagination.page, pagination.limit);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleToggleStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/properties/${propertyId}/status`, {
        active: !currentStatus
      });
      setProperties(properties.map(prop =>
        prop._id === propertyId ? { ...prop, active: !currentStatus } : prop
      ));
    } catch (error) {
      console.error('Error toggling property status:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchProperties(searchTerm, newPage, pagination.limit);
  };

  const renderPropertyRow = (property: any) => (
    <TableRow key={property._id}>
      <TableCell>
        <div>
          <p className="font-medium">{property.title}</p>
          <p className="text-sm text-gray-500">
            {new Date(property.createdAt).toLocaleDateString()}
          </p>
        </div>
      </TableCell>
      <TableCell>
        {property.location?.city && (
          <span>
            {property.location.city}
            {property.location.area && `, ${property.location.area}`}
          </span>
        )}
      </TableCell>
      <TableCell className="font-medium">
        Ksh.{property.price?.toLocaleString()}
      </TableCell>
      <TableCell>
        <Badge className={getStatusBadge(property.status || 'Available')}>
          {property.status || 'Available'}
        </Badge>
      </TableCell>
      <TableCell>
        {property.category?.name || 'N/A'}
        {property.category?.type && (
          <span className="text-xs text-gray-500 block">{property.category.type}</span>
        )}
      </TableCell>
      <TableCell>{property.views || 0}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            checked={property.active !== false}
            onCheckedChange={() => handleToggleStatus(property._id, property.active !== false)}
          />
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(property)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => handleDelete(property._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  if (isLoading && (!properties || properties.length === 0)) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
      </AdminLayout>
    );
  }

  const propertiesList = Array.isArray(properties) ? properties : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
            <p className="text-gray-600 mt-2">Manage your property listings</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-green hover:bg-brand-green/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div>
                <PropertyForm 
                  onClose={() => {
                    setIsAddDialogOpen(false);
                    fetchProperties(searchTerm, pagination.page, pagination.limit);
                  }} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Properties</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Properties ({pagination.total || 0})</CardTitle>
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-green"></div>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : properties.length > 0 ? (
                    propertiesList.map(renderPropertyRow)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No properties found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Property Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <div>
              <PropertyForm 
                property={selectedProperty}
                onClose={() => {
                  setIsEditDialogOpen(false);
                  fetchProperties(searchTerm, pagination.page, pagination.limit);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
