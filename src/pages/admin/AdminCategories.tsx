
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Home } from 'lucide-react';

const AdminCategories = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    type: 'property'
  });

  const categories = [
    {
      id: 1,
      name: 'Maisonette',
      description: 'Multi-level residential property',
      type: 'Property Type',
      active: true,
      propertiesCount: 25,
      dateCreated: '2024-01-10'
    },
    {
      id: 2,
      name: 'Bungalow',
      description: 'Single-story detached house',
      type: 'Property Type',
      active: true,
      propertiesCount: 18,
      dateCreated: '2024-01-08'
    },
    {
      id: 3,
      name: '1 Bedroom',
      description: 'Single bedroom apartment',
      type: 'Bedroom Count',
      active: true,
      propertiesCount: 45,
      dateCreated: '2024-01-05'
    },
    {
      id: 4,
      name: '2 Bedroom',
      description: 'Two bedroom apartment or house',
      type: 'Bedroom Count',
      active: true,
      propertiesCount: 62,
      dateCreated: '2024-01-05'
    },
    {
      id: 5,
      name: '3 Bedroom',
      description: 'Three bedroom house or apartment',
      type: 'Bedroom Count',
      active: true,
      propertiesCount: 38,
      dateCreated: '2024-01-05'
    },
    {
      id: 6,
      name: '4 Bedroom',
      description: 'Four bedroom house',
      type: 'Bedroom Count',
      active: true,
      propertiesCount: 22,
      dateCreated: '2024-01-05'
    },
    {
      id: 7,
      name: 'Studio',
      description: 'Open plan single room living space',
      type: 'Property Type',
      active: true,
      propertiesCount: 15,
      dateCreated: '2024-01-03'
    },
    {
      id: 8,
      name: 'Bedsitter',
      description: 'Single room with kitchenette',
      type: 'Property Type',
      active: true,
      propertiesCount: 32,
      dateCreated: '2024-01-03'
    },
    {
      id: 9,
      name: 'Penthouse',
      description: 'Luxury apartment on top floor',
      type: 'Property Type',
      active: true,
      propertiesCount: 8,
      dateCreated: '2024-01-01'
    }
  ];

  const categoryTypes = [
    'Property Type',
    'Bedroom Count',
    'Price Range',
    'Location Type'
  ];

  const getTypeBadge = (type: string) => {
    const colors = {
      'Property Type': 'bg-blue-100 text-blue-800',
      'Bedroom Count': 'bg-green-100 text-green-800',
      'Price Range': 'bg-purple-100 text-purple-800',
      'Location Type': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddCategory = () => {
    console.log('Adding category:', newCategory);
    setNewCategory({ name: '', description: '', type: 'property' });
    setIsAddDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Categories</h1>
            <p className="text-gray-600 mt-2">Manage property categories and classifications</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., 5 Bedroom"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Input
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the category"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryType">Category Type</Label>
                  <select
                    id="categoryType"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newCategory.type}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {categoryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory} className="bg-teal-600 hover:bg-teal-700">
                    Add Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-teal-600">{categories.length}</div>
              <p className="text-sm text-gray-600">Total Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter(c => c.type === 'Property Type').length}
              </div>
              <p className="text-sm text-gray-600">Property Types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.type === 'Bedroom Count').length}
              </div>
              <p className="text-sm text-gray-600">Bedroom Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {categories.reduce((sum, c) => sum + c.propertiesCount, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories
                  .sort((a, b) => b.propertiesCount - a.propertiesCount)
                  .slice(0, 5)
                  .map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Home className="h-5 w-5 text-teal-600" />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-teal-600">{category.propertiesCount}</p>
                        <p className="text-xs text-gray-500">properties</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryTypes.map((type) => {
                  const typeCategories = categories.filter(c => c.type === type);
                  const totalProperties = typeCategories.reduce((sum, c) => sum + c.propertiesCount, 0);
                  
                  return (
                    <div key={type} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getTypeBadge(type)}>
                          {type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {typeCategories.length} categories • {totalProperties} properties
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {typeCategories.map((category) => (
                          <span key={category.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {category.name} ({category.propertiesCount})
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(category.type)}>
                        {category.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {category.description}
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.propertiesCount}
                    </TableCell>
                    <TableCell>
                      <Badge className={category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {category.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
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
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
