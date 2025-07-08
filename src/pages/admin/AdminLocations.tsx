
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const AdminLocations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('country');
  const [newLocation, setNewLocation] = useState({
    name: '',
    parent: '',
    level: 'country'
  });

  const locationHierarchy = {
    Kenya: {
      Nairobi: {
        Westlands: ['Parklands', 'Kangemi', 'Mountain View'],
        Karen: ['Karen C', 'Langata', 'Hardy'],
        Embakasi: ['Umoja', 'Kayole', 'Dandora'],
        CBD: ['Upper Hill', 'Kilimani', 'Hurlingham']
      },
      Mombasa: {
        'Mombasa Island': ['Old Town', 'Ganjoni', 'Majengo'],
        Likoni: ['Shika Adabu', 'Mtongwe', 'Timbwani'],
        Nyali: ['Nyali Beach', 'Cinemax', 'Links']
      },
      Kisumu: {
        'Kisumu Central': ['Market', 'Kondele', 'Migosi'],
        'Kisumu East': ['Kajulu', 'Kolwa East', 'Manyatta']
      }
    }
  };

  const flattenLocations = () => {
    const locations = [];
    
    // Countries
    Object.keys(locationHierarchy).forEach(country => {
      locations.push({
        id: `country-${country}`,
        name: country,
        level: 'Country',
        parent: '',
        children: Object.keys(locationHierarchy[country as keyof typeof locationHierarchy]).length,
        properties: 156
      });

      // Cities
      Object.keys(locationHierarchy[country as keyof typeof locationHierarchy]).forEach(city => {
        locations.push({
          id: `city-${city}`,
          name: city,
          level: 'City',
          parent: country,
          children: Object.keys(locationHierarchy[country as keyof typeof locationHierarchy][city as keyof typeof locationHierarchy[typeof country]]).length,
          properties: Math.floor(Math.random() * 50) + 10
        });

        // Areas
        Object.keys(locationHierarchy[country as keyof typeof locationHierarchy][city as keyof typeof locationHierarchy[typeof country]]).forEach(area => {
          locations.push({
            id: `area-${area}`,
            name: area,
            level: 'Area',
            parent: `${country} > ${city}`,
            children: locationHierarchy[country as keyof typeof locationHierarchy][city as keyof typeof locationHierarchy[typeof country]][area as keyof typeof locationHierarchy[typeof country][typeof city]].length,
            properties: Math.floor(Math.random() * 20) + 5
          });

          // Sub Areas
          locationHierarchy[country as keyof typeof locationHierarchy][city as keyof typeof locationHierarchy[typeof country]][area as keyof typeof locationHierarchy[typeof country][typeof city]].forEach(subArea => {
            locations.push({
              id: `subarea-${subArea}`,
              name: subArea,
              level: 'Sub Area',
              parent: `${country} > ${city} > ${area}`,
              children: 0,
              properties: Math.floor(Math.random() * 10) + 1
            });
          });
        });
      });
    });

    return locations;
  };

  const locations = flattenLocations();

  const getLevelBadge = (level: string) => {
    const colors = {
      'Country': 'bg-purple-100 text-purple-800',
      'City': 'bg-blue-100 text-blue-800',
      'Area': 'bg-green-100 text-green-800',
      'Sub Area': 'bg-orange-100 text-orange-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
            <p className="text-gray-600 mt-2">Manage location hierarchy for property listings</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="locationLevel">Location Level</Label>
                  <select
                    id="locationLevel"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newLocation.level}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, level: e.target.value }))}
                  >
                    <option value="country">Country</option>
                    <option value="city">City</option>
                    <option value="area">Area</option>
                    <option value="subarea">Sub Area</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input
                    id="locationName"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Nairobi"
                  />
                </div>

                {newLocation.level !== 'country' && (
                  <div>
                    <Label htmlFor="parentLocation">Parent Location</Label>
                    <select
                      id="parentLocation"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={newLocation.parent}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, parent: e.target.value }))}
                    >
                      <option value="">Select Parent Location</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Kenya > Nairobi">Kenya > Nairobi</option>
                      <option value="Kenya > Mombasa">Kenya > Mombasa</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Add Location
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
              <div className="text-2xl font-bold text-purple-600">1</div>
              <p className="text-sm text-gray-600">Countries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Cities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">7</div>
              <p className="text-sm text-gray-600">Areas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">19</div>
              <p className="text-sm text-gray-600">Sub Areas</p>
            </CardContent>
          </Card>
        </div>

        {/* Location Hierarchy Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Location Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(locationHierarchy).map(country => (
                <div key={country} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span className="font-bold text-lg">{country}</span>
                    <Badge className="bg-purple-100 text-purple-800">Country</Badge>
                  </div>
                  
                  <div className="ml-6 space-y-3">
                    {Object.keys(locationHierarchy[country as keyof typeof locationHierarchy]).map(city => (
                      <div key={city} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">{city}</span>
                          <Badge className="bg-blue-100 text-blue-800">City</Badge>
                        </div>
                        
                        <div className="ml-4 space-y-2">
                          {Object.keys(locationHierarchy[country as keyof typeof locationHierarchy][city as keyof typeof locationHierarchy[typeof country]]).map(area => (
                            <div key={area} className="border-l-2 border-gray-100 pl-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <MapPin className="h-3 w-3 text-green-600" />
                                <span className="text-sm font-medium">{area}</span>
                                <Badge variant="outline" className="text-xs">Area</Badge>
                              </div>
                              
                              <div className="ml-3 flex flex-wrap gap-1">
                                {locationHierarchy[country as keyof typeof locationHierarchy][city as keyof typeof locationHierarchy[typeof country]][area as keyof typeof locationHierarchy[typeof country][typeof city]].map(subArea => (
                                  <Badge key={subArea} variant="outline" className="text-xs bg-orange-50">
                                    {subArea}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations ({locations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{location.name}</p>
                      {location.parent && (
                        <p className="text-sm text-gray-500">{location.parent}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={getLevelBadge(location.level)}>
                      {location.level}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {location.children > 0 && `${location.children} children • `}
                      {location.properties} properties
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminLocations;
