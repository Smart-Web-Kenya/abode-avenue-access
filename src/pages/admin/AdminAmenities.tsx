import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Wifi, Car, Dumbbell, Shield, Trees, Waves, Home, Zap } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Amenity {
  _id: string;
  name: string;
  icon: string;
  active: boolean;
  category: string;
}

const iconComponents: { [key: string]: React.ElementType } = {
  Wifi, Car, Dumbbell, Shield, Trees, Waves, Home, Zap
};

const AdminAmenities = () => {
  const { hasRole } = useAuth();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [newAmenity, setNewAmenity] = useState({ name: '', icon: 'Wifi', category: 'general' });
  const [iconOptions, setIconOptions] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchAmenities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/v1/amenities');
      // The API returns amenities grouped by category, so we flatten them
      const flattenedAmenities = Object.values(response.data.data).flat() as Amenity[];
      setAmenities(flattenedAmenities);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      toast({ title: 'Error', description: 'Failed to fetch amenities', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIconOptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/v1/amenities/icons');
      setIconOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching icon options:', error);
    }
  };

  useEffect(() => {
    fetchAmenities();
    fetchIconOptions();
  }, []);

  const handleAddAmenity = async () => {
    try {
      await axios.post('http://127.0.0.1:3000/api/v1/amenities', newAmenity);
      toast({ title: 'Success', description: 'Amenity added successfully' });
      setIsAddDialogOpen(false);
      fetchAmenities();
      setNewAmenity({ name: '', icon: 'Wifi', category: 'general' });
    } catch (error) {
      console.error('Error adding amenity:', error);
      toast({ title: 'Error', description: 'Failed to add amenity', variant: 'destructive' });
    }
  };

  const handleUpdateAmenity = async () => {
    if (!selectedAmenity) return;
    try {
      await axios.put(`http://127.0.0.1:3000/api/v1/amenities/${selectedAmenity._id}`, selectedAmenity);
      toast({ title: 'Success', description: 'Amenity updated successfully' });
      setIsEditDialogOpen(false);
      fetchAmenities();
    } catch (error) {
      console.error('Error updating amenity:', error);
      toast({ title: 'Error', description: 'Failed to update amenity', variant: 'destructive' });
    }
  };

  const handleDeleteAmenity = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      try {
        await axios.delete(`http://127.0.0.1:3000/api/v1/amenities/${id}`);
        toast({ title: 'Success', description: 'Amenity deleted successfully' });
        fetchAmenities();
      } catch (error) {
        console.error('Error deleting amenity:', error);
        toast({ title: 'Error', description: 'Failed to delete amenity', variant: 'destructive' });
      }
    }
  };

  const handleToggleActive = async (amenity: Amenity) => {
    try {
      await axios.patch(`http://127.0.0.1:3000/api/v1/amenities/${amenity._id}/toggle`);
      toast({ title: 'Success', description: `Amenity ${amenity.active ? 'deactivated' : 'activated'}` });
      fetchAmenities();
    } catch (error) {
      console.error('Error toggling amenity status:', error);
      toast({ title: 'Error', description: 'Failed to toggle status', variant: 'destructive' });
    }
  };

  const openEditDialog = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setIsEditDialogOpen(true);
  };

  const renderAmenityRow = (amenity: Amenity) => {
    const IconComponent = iconComponents[amenity.icon] || Home; // Fallback to Home icon
    return (
      <tr key={amenity._id} className="border-b">
        <td className="p-4 flex items-center">
          <IconComponent className="h-5 w-5 mr-3 text-gray-600" />
          {amenity.name}
        </td>
        <td className="p-4">{amenity.category}</td>
        <td className="p-4">
          <Switch
            checked={amenity.active}
            onCheckedChange={() => handleToggleActive(amenity)}
          />
        </td>
        <td className="p-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => openEditDialog(amenity)}><Edit className="h-4 w-4" /></Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteAmenity(amenity._id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Amenities</h1>
            <p className="text-gray-600 mt-2">Manage property amenities</p>
          </div>
          {hasRole('admin') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-green hover:bg-brand-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Amenity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Amenity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={newAmenity.name} onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <select id="icon" value={newAmenity.icon} onChange={(e) => setNewAmenity({ ...newAmenity, icon: e.target.value })} className="w-full p-2 border rounded-md">
                      {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select id="category" value={newAmenity.category} onChange={(e) => setNewAmenity({ ...newAmenity, category: e.target.value })} className="w-full p-2 border rounded-md">
                      <option value="general">General</option>
                      <option value="safety">Safety</option>
                      <option value="appliances">Appliances</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="pets">Pets</option>
                      <option value="accessibility">Accessibility</option>
                    </select>
                  </div>
                  <Button onClick={handleAddAmenity}>Add Amenity</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Amenities ({amenities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Active</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                  ) : (
                    amenities.map(renderAmenityRow)
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {selectedAmenity && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Amenity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" value={selectedAmenity.name} onChange={(e) => setSelectedAmenity({ ...selectedAmenity, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Icon</Label>
                  <select id="edit-icon" value={selectedAmenity.icon} onChange={(e) => setSelectedAmenity({ ...selectedAmenity, icon: e.target.value })} className="w-full p-2 border rounded-md">
                    {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <select id="edit-category" value={selectedAmenity.category} onChange={(e) => setSelectedAmenity({ ...selectedAmenity, category: e.target.value })} className="w-full p-2 border rounded-md">
                    <option value="general">General</option>
                    <option value="safety">Safety</option>
                    <option value="appliances">Appliances</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="pets">Pets</option>
                    <option value="accessibility">Accessibility</option>
                  </select>
                </div>
                <Button onClick={handleUpdateAmenity}>Update Amenity</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAmenities;
