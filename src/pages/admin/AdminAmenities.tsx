
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Wifi, Car, Dumbbell, Shield, Trees, Waves, Home, Zap } from 'lucide-react';

const AdminAmenities = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
    { id: 3, name: 'Fitness Center', icon: 'Dumbbell', active: true, usageCount: 22 },
    { id: 4, name: 'Security System', icon: 'Shield', active: true, usageCount: 41 },
    { id: 5, name: 'Garden/Landscaping', icon: 'Trees', active: true, usageCount: 19 },
    { id: 6, name: 'Swimming Pool', icon: 'Waves', active: false, usageCount: 8 },
    { id: 7, name: 'Backup Generator', icon: 'Zap', active: true, usageCount: 15 }
  ];

  const getIconComponent = (iconName: string) => {
    const iconObj = iconOptions.find(opt => opt.name === iconName);
    return iconObj ? iconObj.icon : Wifi;
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
              <Button className="bg-teal-600 hover:bg-teal-700">
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
                        return <IconComponent className="h-5 w-5 text-teal-600" />;
                      })()}
                      <span>{newAmenity.name || 'Amenity Name'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAmenity} className="bg-teal-600 hover:bg-teal-700">
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
              <div className="text-2xl font-bold text-teal-600">{amenities.length}</div>
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
              <div className="text-2xl font-bold text-blue-600">
                {amenities.reduce((sum, a) => sum + a.usageCount, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Amenities Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amenity</TableHead>
                  <TableHead>Icon Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amenities.map((amenity) => {
                  const IconComponent = getIconComponent(amenity.icon);
                  return (
                    <TableRow key={amenity.id}>
                      <TableCell className="font-medium">{amenity.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-teal-600" />
                          <span className="text-sm text-gray-500">{amenity.icon}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          amenity.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {amenity.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{amenity.usageCount} properties</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAmenities;
