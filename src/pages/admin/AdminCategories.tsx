import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Home } from 'lucide-react';

const AdminCategories = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    type: 'property'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/v1/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryTypes = [
    'Property Type',
    'Bedroom Count',
    'Price Range',
    'Location Type'
  ];

  const getTypeBadge = (type: string) => {
    const colors = {
      'Property Type': 'bg-blue-100 text-blue-800',
      'Bedroom Count': 'bg-brand-green/10 text-brand-green',
      'Price Range': 'bg-purple-100 text-purple-800',
      'Location Type': 'bg-brand-orange/10 text-brand-orange'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      await axios.delete(`http://127.0.0.1:3000/api/v1/categories/${categoryId}`);
      
      // Remove the category from the local state
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
      // Show success message
      console.log('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      } else {
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:3000/api/v1/categories/${categoryId}/status`);
      
      // Update the category in the local state
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, active: response.data.active } 
          : cat
      ));
    } catch (error) {
      console.error('Error toggling category status:', error);
      // You might want to show an error toast here
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/v1/categories/', {
        name: newCategory.name,
        description: newCategory.description,
        type: newCategory.type,
        active: true,
        propertiesCount: 0,
        dateCreated: new Date().toISOString().split('T')[0]
      });
      
      // Add the new category to the list
      setCategories([...categories, response.data]);
      
      // Reset form and close modal
      setNewCategory({ name: '', description: '', type: 'property' });
      setIsAddDialogOpen(false);
      
      // Show success message (you might want to add a toast notification here)
      console.log('Category added successfully:', response.data);
    } catch (error) {
      console.error('Error adding category:', error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      const response = await axios.put(
        `http://127.0.0.1:3000/api/v1/categories/${selectedCategory.id}`,
        {
          name: selectedCategory.name,
          description: selectedCategory.description,
          type: selectedCategory.type,
          active: selectedCategory.active
        }
      );
      
      // Update the category in the local state
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? response.data : cat
      ));
      
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      
      // Show success message
      console.log('Category updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating category:', error);
      // Show error message
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
      </AdminLayout>
    );
  }

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
              <Button className="bg-brand-green hover:bg-brand-green/90">
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
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="e.g., 5 Bedroom"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Input
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="Brief description of the category"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryType">Category Type</Label>
                  <select
                    id="categoryType"
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Button 
                    className="bg-brand-green hover:bg-brand-green/90"
                    onClick={handleAddCategory}
                    disabled={!newCategory.name.trim()}
                  >
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
              <div className="text-2xl font-bold text-brand-green">{categories.length}</div>
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
              <div className="text-2xl font-bold text-brand-green">
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

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Home className="h-5 w-5 text-brand-green" />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <Badge className={getTypeBadge(category.type)}>
                      {category.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      {category.propertiesCount} properties
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={category.active}
                        onCheckedChange={(checked) => handleToggleStatus(category.id, category.active)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {selectedCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    value={selectedCategory?.name || ''}
                    onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                    placeholder="e.g., 5 Bedroom"
                  />
                </div>
                <div>
                  <Label htmlFor="editCategoryDescription">Description</Label>
                  <Input
                    id="editCategoryDescription"
                    value={selectedCategory?.description || ''}
                    onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                    placeholder="Brief description of the category"
                  />
                </div>
                <div>
                  <Label htmlFor="editCategoryType">Category Type</Label>
                  <select
                    id="editCategoryType"
                    value={selectedCategory?.type || 'Property Type'}
                    onChange={(e) => setSelectedCategory({...selectedCategory, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categoryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editCategoryStatus"
                    checked={selectedCategory?.active ?? true}
                    onCheckedChange={(checked) => setSelectedCategory({...selectedCategory, active: checked})}
                  />
                  <Label htmlFor="editCategoryStatus">
                    {selectedCategory?.active ? 'Active' : 'Inactive'}
                  </Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setSelectedCategory(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-brand-green hover:bg-brand-green/90"
                    onClick={handleUpdateCategory}
                    disabled={!selectedCategory?.name?.trim()}
                  >
                    Update Category
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
