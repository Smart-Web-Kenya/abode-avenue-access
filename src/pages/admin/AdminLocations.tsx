import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Location {
  _id: string;
  name: string;
  level: 'country' | 'city' | 'area' | 'subarea';
  parent: { _id: string; name: string } | null;
  propertiesCount: number;
  active: boolean;
}

const AdminLocations = () => {
  const { hasRole } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({ name: '', level: 'country', parent: '' });
  const { toast } = useToast();

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/v1/locations');
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({ title: 'Error', description: 'Failed to fetch locations', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async () => {
    try {
      const payload = { ...newLocation, parent: newLocation.parent || null };
      await axios.post('http://127.0.0.1:3000/api/v1/locations', payload);
      toast({ title: 'Success', description: 'Location added successfully' });
      setIsAddDialogOpen(false);
      fetchLocations();
      setNewLocation({ name: '', level: 'country', parent: '' });
    } catch (error: any) {
      console.error('Error adding location:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to add location', variant: 'destructive' });
    }
  };

  const handleUpdateLocation = async () => {
    if (!selectedLocation) return;
    try {
      await axios.put(`http://127.0.0.1:3000/api/v1/locations/${selectedLocation._id}`, { name: selectedLocation.name });
      toast({ title: 'Success', description: 'Location updated successfully' });
      setIsEditDialogOpen(false);
      fetchLocations();
    } catch (error: any) {
      console.error('Error updating location:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update location', variant: 'destructive' });
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`http://127.0.0.1:3000/api/v1/locations/${id}`);
        toast({ title: 'Success', description: 'Location deleted successfully' });
        fetchLocations();
      } catch (error: any) {
        console.error('Error deleting location:', error);
        toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete location', variant: 'destructive' });
      }
    }
  };

  const handleToggleActive = async (location: Location) => {
    try {
      await axios.patch(`http://127.0.0.1:3000/api/v1/locations/${location._id}/toggle`);
      toast({ title: 'Success', description: `Location status updated` });
      fetchLocations();
    } catch (error) {
      console.error('Error toggling location status:', error);
      toast({ title: 'Error', description: 'Failed to toggle status', variant: 'destructive' });
    }
  };

  const openEditDialog = (location: Location) => {
    setSelectedLocation(location);
    setIsEditDialogOpen(true);
  };

  const stats = useMemo(() => {
    return locations.reduce((acc, loc) => {
      if (loc.level === 'country') acc.countries++;
      if (loc.level === 'city') acc.cities++;
      if (loc.level === 'area') acc.areas++;
      if (loc.level === 'subarea') acc.subareas++;
      return acc;
    }, { countries: 0, cities: 0, areas: 0, subareas: 0 });
  }, [locations]);

  const getLevelBadge = (level: string) => {
    const colors: { [key: string]: string } = {
      'country': 'bg-purple-100 text-purple-800',
      'city': 'bg-blue-100 text-blue-800',
      'area': 'bg-green-100 text-green-800',
      'subarea': 'bg-yellow-100 text-yellow-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Locations Management</h1>
          {hasRole('admin') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> Add Location</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <select id="level" value={newLocation.level} onChange={(e) => setNewLocation({ ...newLocation, level: e.target.value as any })} className="w-full p-2 border rounded-md">
                      <option value="country">Country</option>
                      <option value="city">City</option>
                      <option value="area">Area</option>
                      <option value="subarea">Subarea</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="parent">Parent Location</Label>
                    <select id="parent" value={newLocation.parent} onChange={(e) => setNewLocation({ ...newLocation, parent: e.target.value })} className="w-full p-2 border rounded-md">
                      <option value="">None (Top Level)</option>
                      {locations.map(loc => <option key={loc._id} value={loc._id}>{loc.name} ({loc.level})</option>)}
                    </select>
                  </div>
                  <Button onClick={handleAddLocation}>Add Location</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="p-6"><div className="text-2xl font-bold text-purple-600">{stats.countries}</div><p className="text-sm text-gray-600">Countries</p></CardContent></Card>
          <Card><CardContent className="p-6"><div className="text-2xl font-bold text-blue-600">{stats.cities}</div><p className="text-sm text-gray-600">Cities</p></CardContent></Card>
          <Card><CardContent className="p-6"><div className="text-2xl font-bold text-green-600">{stats.areas}</div><p className="text-sm text-gray-600">Areas</p></CardContent></Card>
          <Card><CardContent className="p-6"><div className="text-2xl font-bold text-yellow-600">{stats.subareas}</div><p className="text-sm text-gray-600">Subareas</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Locations ({locations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Level</th>
                    <th className="p-3 text-left">Parent</th>
                    <th className="p-3 text-left">Properties</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
                  ) : (locations.map(loc => (
                    <tr key={loc._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium"><MapPin className="inline h-4 w-4 mr-2 text-gray-400" />{loc.name}</td>
                      <td className="p-3"><Badge className={getLevelBadge(loc.level)}>{loc.level}</Badge></td>
                      <td className="p-3 text-sm text-gray-600">{loc.parent?.name || 'N/A'}</td>
                      <td className="p-3 text-sm text-gray-600">{loc.propertiesCount}</td>
                      <td className="p-3"><Switch checked={loc.active} onCheckedChange={() => handleToggleActive(loc)} /></td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(loc)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteLocation(loc._id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {selectedLocation && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Location</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" value={selectedLocation.name} onChange={(e) => setSelectedLocation({ ...selectedLocation, name: e.target.value })} />
                </div>
                <Button onClick={handleUpdateLocation}>Update Location</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLocations;
