import { useState, useEffect } from 'react';
import axios from 'axios';
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

const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';

const AdminProperties = () => {
  console.log('Component rendering...');
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
  const fetchProperties = async (search = '', page = 1) => {
    console.log('Starting fetchProperties with:', { search, page });
    setIsLoading(true);
    try {
      console.log('Making API call to:', `${API_BASE_URL}/properties`);
      const response = await axios.get(`${API_BASE_URL}/properties`, {
        // params: {
        //   // search,
        //   // page,
        //   // limit: pagination.limit,
        //   // populate: 'category',
        //   sort: '-createdAt'
        // }
      });

      console.log('API Response:', response);
      console.log('Response data:', response.data);

      if (response.data.success) {
        const propertiesList = Array.isArray(response.data.data) 
          ? response.data.data 
          : [];
        
        console.log('Processed properties list:', propertiesList);
        setProperties(propertiesList);
        
        console.log('Updating pagination with:', {
          page: response.data.currentPage || 1,
          total: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 1
        });
        
        setPagination(prev => ({
          ...prev,
          page: response.data.currentPage || 1,
          total: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 1
        }));
      } else {
        console.error('API returned success:false');
        setProperties([]);
      }
    } catch (error) {
      console.error('Error in fetchProperties:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          response: error.response,
          request: error.request
        });
      }
      setProperties([]);
    } finally {
      console.log('Finished fetchProperties, setting loading to false');
      setIsLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    console.log('Search term changed, setting up debounce');
    const timer = setTimeout(() => {
      console.log('Debounce timeout reached, fetching properties');
      fetchProperties(searchTerm);
    }, 500);
    
    return () => {
      console.log('Cleaning up previous debounce timer');
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Initial fetch
  useEffect(() => {
    console.log('useEffect triggered, calling fetchProperties');
    fetchProperties();
  }, [pagination.page, pagination.limit]);

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
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/properties/${propertyId}`);
      fetchProperties(searchTerm, pagination.page);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleToggleStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/properties/${propertyId}/status`, {
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
    setPagination({...pagination, page: newPage});
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
        ${property.price?.toLocaleString()}
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
              <PropertyForm 
                onClose={() => {
                  setIsAddDialogOpen(false);
                  fetchProperties(searchTerm, pagination.page);
                }} 
              />
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <PropertyForm 
              property={selectedProperty} 
              onClose={() => {
                setIsEditDialogOpen(false);
                fetchProperties(searchTerm, pagination.page);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
