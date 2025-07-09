
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Wifi, Car, Dumbbell, Shield, Trees, Waves, Home, Zap } from 'lucide-react';

const AdminAmenities = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [newAmenity, setNewAmenity] = useState({ name: '', icon: 'Wifi' });

  const iconOptions = [
    { name: 'Wifi', icon: Wifi },
    { name: 'Car', icon: Car },
    { name: 'Dumbbell', icon: Dumbbell },
    { name: 'Shield', icon: Shield },
    { name: 'Trees', icon: Trees },
    { name: 'Waves', icon: Waves },
    { name: 'Home', icon: Home },
    { name: 'Zap', icon: Zap }
  ];

  const amenities = [
    { id: 1, name: 'WiFi Included', icon: 'Wifi', active: true, usageCount: 45 },
    { id: 2, name: 'Parking Space', icon: 'Car', active: true, usageCount: 38 },
    { id: 3, name: 'Fitness Center', icon: 'Dumbbell', active: false, usageCount: 22 },
    { id: 4, name: 'Security System', icon: 'Shield', active: true, usageCount: 41 },
    { id: 5, name: 'Garden/Landscaping', icon: 'Trees', active: true, usageCount: 19 },
    { id: 6, name: 'Swimming Pool', icon: 'Waves', active: false, usageCount: 8 },
    { id: 7, name: 'Backup Generator', icon: 'Zap', active: true, usageCount: 15 }
  ];

  const getIconComponent = (iconName: string) => {
    const iconObj = iconOptions.find(opt => opt.name === iconName);
    return iconObj ? iconObj.icon : Wifi;
  };

  const handleEdit = (amenity: any) => {
    setSelectedAmenity(amenity);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (amenityId: number) => {
    console.log('Deleting amenity:', amenityId);
  };

  const handleToggleStatus = (amenityId: number, currentStatus: boolean) => {
    console.log('Toggling status for amenity:', amenityId, 'from', currentStatus, 'to', !currentStatus);
  };

  const handleAddAmenity = () => {
    console.log('Adding amenity:', newAmenity);
    setNewAmenity({ name: '', icon: 'Wifi' });
    setIsAddDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Amenities Management</h1>
            <p className="text-gray-600 mt-2">Create and manage property amenities</p>
          </div>
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
                  <Label htmlFor="amenityName">Amenity Name</Label>
                  <Input
                    id="amenityName"
                    value={newAmenity.name}
                    onChange={(e) => setNewAmenity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Swimming Pool"
                  />
                </div>
                <div>
                  <Label htmlFor="amenityIcon">Select Icon</Label>
                  <select
                    id="amenityIcon"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newAmenity.icon}
                    onChange={(e) => setNewAmenity(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    {iconOptions.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const IconComponent = getIconComponent(newAmenity.icon);
                        return <IconComponent className="h-5 w-5 text-brand-green" />;
                      })()}
                      <span>{newAmenity.name || 'Amenity Name'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAmenity} className="bg-brand-green hover:bg-brand-green/90">
                    Add Amenity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-brand-green">{amenities.length}</div>
              <p className="text-sm text-gray-600">Total Amenities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {amenities.filter(a => a.active).length}
              </div>
              <p className="text-sm text-gray-600">Active Amenities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {amenities.reduce((sum, a) => sum + a.usageCount, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Amenities List */}
        <Card>
          <CardHeader>
            <CardTitle>All Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {amenities.map((amenity) => {
                const IconComponent = getIconComponent(amenity.icon);
                return (
                  <div key={amenity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <IconComponent className="h-5 w-5 text-brand-green" />
                      <div>
                        <p className="font-medium">{amenity.name}</p>
                        <p className="text-sm text-gray-500">{amenity.usageCount} properties</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={amenity.active}
                        onCheckedChange={(checked) => handleToggleStatus(amenity.id, amenity.active)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(amenity)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(amenity.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Amenity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editAmenityName">Amenity Name</Label>
                <Input
                  id="editAmenityName"
                  value={selectedAmenity?.name || ''}
                  onChange={(e) => setSelectedAmenity(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Swimming Pool"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-brand-green hover:bg-brand-green/90">
                  Update Amenity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAmenities;
