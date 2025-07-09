
import { useState } from 'react';
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

  // Mock data
  const properties = [
    {
      id: 1,
      title: 'Modern Downtown Loft',
      location: 'Nairobi, Westlands',
      price: 450000,
      status: 'Available',
      category: '2 Bedroom',
      dateAdded: '2024-01-15',
      views: 245,
      active: true
    },
    {
      id: 2,
      title: 'Family Maisonette',
      location: 'Nairobi, Karen',
      price: 750000,
      status: 'Sold',
      category: 'Maisonette',
      dateAdded: '2024-01-10',
      views: 189,
      active: true
    },
    {
      id: 3,
      title: 'Luxury Bungalow',
      location: 'Nairobi, Runda',
      price: 1200000,
      status: 'Available',
      category: 'Bungalow',
      dateAdded: '2024-01-08',
      views: 356,
      active: false
    }
  ];

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

  const handleDelete = (propertyId: number) => {
    console.log('Deleting property:', propertyId);
  };

  const handleToggleStatus = (propertyId: number, currentStatus: boolean) => {
    console.log('Toggling status for property:', propertyId, 'from', currentStatus, 'to', !currentStatus);
  };

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
              <PropertyForm onClose={() => setIsAddDialogOpen(false)} />
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
          <CardHeader>
            <CardTitle>All Properties ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-gray-500">Added {property.dateAdded}</p>
                      </div>
                    </TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell className="font-medium">
                      Ksh {property.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(property.status)}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.category}</TableCell>
                    <TableCell>{property.views}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={property.active}
                          onCheckedChange={(checked) => handleToggleStatus(property.id, property.active)}
                        />
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(property)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(property.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <PropertyForm property={selectedProperty} onClose={() => setIsEditDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
