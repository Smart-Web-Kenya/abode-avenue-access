import { useState, useRef, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Image {
  url: string;
  public_id: string;
}

interface PropertyFormProps {
  onClose: () => void;
  property?: any;
  onSave?: (property: any) => void;
}

interface Category {
  _id: string;
  name: string;
  type: string;
}

interface Amenity {
  _id: string;
  name: string;
}

interface Location {
  _id: string;
  name: string;
  level: 'country' | 'city' | 'area' | 'subarea';
}

const PropertyForm = ({ onClose, property, onSave }: PropertyFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: property?.title || '',
    price: property?.price || '',
    description: property?.description || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    sqft: property?.sqft || '',
    yearBuilt: property?.yearBuilt || '',
    video360Url: property?.video360Url || '',
    images: (property?.images || []) as Image[],
    contactPhones: property?.contactPhones || [''],
    socialMedia: {
      facebook: property?.socialMedia?.facebook || '',
      instagram: property?.socialMedia?.instagram || '',
      twitter: property?.socialMedia?.twitter || '',
      whatsapp: property?.socialMedia?.whatsapp || ''
    },
    selectedAmenities: property?.amenities?.map((a: any) => a.name) || [],
    location: {
      country: property?.location?.country || '',
      city: property?.location?.city || '',
      area: property?.location?.area || '',
      subArea: property?.location?.subArea || ''
    },
    category: property?.category?._id || property?.category || ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [locations, setLocations] = useState<{ countries: Location[], cities: Location[], areas: Location[], subareas: Location[] }>({ countries: [], cities: [], areas: [], subareas: [] });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch amenities
        const amenitiesRes = await axios.get('http://127.0.0.1:3000/api/v1/amenities?active=true', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        const flattenedAmenities = Object.values(amenitiesRes.data.data).flat() as Amenity[];
        setAmenities(flattenedAmenities);

        // Fetch top-level locations (countries)
        const countriesRes = await axios.get('http://127.0.0.1:3000/api/v1/locations?level=country', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        setLocations(prev => ({ ...prev, countries: countriesRes.data.data }));
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({ title: 'Error', description: 'Failed to load form data', variant: 'destructive' });
      }
    };
    fetchInitialData();
  }, [toast]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:3000/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        if (response.data.success && response.data.data) {
          setCurrentUserId(response.data.data._id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLocationChange = async (level: 'country' | 'city' | 'area', parentId: string) => {
    const newLocationState = { ...formData.location };
    let nextLocationsState = { ...locations };

    if (level === 'country') {
      newLocationState.country = parentId;
      newLocationState.city = '';
      newLocationState.area = '';
      newLocationState.subArea = '';
      nextLocationsState.cities = [];
      nextLocationsState.areas = [];
      nextLocationsState.subareas = [];
      if (parentId) {
        const citiesRes = await axios.get(`http://127.0.0.1:3000/api/v1/locations?level=city&parent=${parentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache'
          }
        });
        nextLocationsState.cities = citiesRes.data.data;
      }
    } else if (level === 'city') {
      newLocationState.city = parentId;
      newLocationState.area = '';
      newLocationState.subArea = '';
      nextLocationsState.areas = [];
      nextLocationsState.subareas = [];
      if (parentId) {
        const areasRes = await axios.get(`http://127.0.0.1:3000/api/v1/locations?level=area&parent=${parentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache'
          }
        });
        nextLocationsState.areas = areasRes.data.data;
      }
    } else if (level === 'area') {
      newLocationState.area = parentId;
      newLocationState.subArea = '';
      nextLocationsState.subareas = [];
      if (parentId) {
        const subareasRes = await axios.get(`http://127.0.0.1:3000/api/v1/locations?level=subarea&parent=${parentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache'
          }
        });
        nextLocationsState.subareas = subareasRes.data.data;
      }
    }

    setFormData(prev => ({ ...prev, location: newLocationState }));
    setLocations(nextLocationsState);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(\+254|0)?[17]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const addContactPhone = () => {
    setFormData(prev => ({
      ...prev,
      contactPhones: [...prev.contactPhones, '']
    }));
  };

  const removeContactPhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactPhones: prev.contactPhones.filter((_, i) => i !== index)
    }));
  };

  const updateContactPhone = (index: number, value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      contactPhones: prev.contactPhones.map((phone, i) => i === index ? cleanedValue : phone)
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity]
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = formData.images[index];
    try {
      await axios.delete(`http://127.0.0.1:3000/api/v1/properties/image/${imageToRemove.public_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache'
        }
      });
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      toast({ title: 'Success', description: 'Image removed successfully' });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({ title: 'Error', description: 'Failed to remove image', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId && !property?._id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a property',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('price', formData.price.toString());
      fd.append('description', formData.description);
      fd.append('bedrooms', formData.bedrooms.toString());
      fd.append('bathrooms', formData.bathrooms.toString());
      fd.append('sqft', formData.sqft.toString());
      fd.append('yearBuilt', formData.yearBuilt.toString());
      fd.append('video360Url', formData.video360Url);
      fd.append('location', JSON.stringify(formData.location));
      fd.append('category', formData.category);
      
      // Add agent_id only when creating a new property
      if (!property?._id && currentUserId) {
        fd.append('agent_id', currentUserId);
      }

      formData.contactPhones.forEach(p => fd.append('contactPhones[]', p));
      formData.selectedAmenities.forEach(a => fd.append('selectedAmenities[]', a));

      formData.images.forEach(img => fd.append('existingImages[]', JSON.stringify(img)));
      selectedFiles.forEach(file => fd.append('images', file));

      let response;
      if (property?._id) {
        response = await axios.put(
          `http://127.0.0.1:3000/api/v1/properties/${property._id}`,
          fd,
          { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.post(
          'http://127.0.0.1:3000/api/v1/properties',
          fd,
          { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } }
        );
      }

      toast({
        title: 'Success',
        description: `Property ${property?._id ? 'updated' : 'created'} successfully`
      });

      if (onSave) onSave(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error saving property:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await axios.get('http://127.0.0.1:3000/api/v1/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache'
          }
        });
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const getSelectedCategoryName = () => {
    if (!formData.category) return '';
    const selectedCategory = categories.find(cat => cat._id === formData.category);
    return selectedCategory ? `${selectedCategory.name} (${selectedCategory.type})` : '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Modern Apartment in Nairobi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="5000000"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2"
                min="0"
                step="0.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqft">Area (sqft) *</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                placeholder="1500"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built *</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Describe the property in detail..."
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Category *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isLoadingCategories ? (
              <div>Loading categories...</div>
            ) : (
              <div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name} ({category.type})
                    </option>
                  ))}
                </select>
                {formData.category && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {getSelectedCategoryName()}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select id="country" value={formData.location.country} onChange={(e) => handleLocationChange('country', e.target.value)} className="w-full p-2 border rounded-md">
                <option value="">Select Country</option>
                {locations.countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <select id="city" value={formData.location.city} onChange={(e) => handleLocationChange('city', e.target.value)} className="w-full p-2 border rounded-md" disabled={!formData.location.country}>
                <option value="">Select City</option>
                {locations.cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <select id="area" value={formData.location.area} onChange={(e) => handleLocationChange('area', e.target.value)} className="w-full p-2 border rounded-md" disabled={!formData.location.city}>
                <option value="">Select Area</option>
                {locations.areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subArea">Sub Area</Label>
              <select id="subArea" value={formData.location.subArea} onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, subArea: e.target.value } }))} className="w-full p-2 border rounded-md" disabled={!formData.location.area}>
                <option value="">Select Sub Area</option>
                {locations.subareas.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {formData.images.map((img, index) => (
              <div key={img.public_id || index} className="relative group">
                <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {selectedFiles.map((file, index) => (
              <div key={index} className="w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload</span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Contact Phone Numbers</Label>
              {formData.contactPhones.map((phone, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Input
                    value={phone}
                    onChange={(e) => updateContactPhone(index, e.target.value)}
                    placeholder="+254 712 345 678"
                    type="tel"
                    className="flex-1"
                  />
                  {formData.contactPhones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContactPhone(index)}
                      className="text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContactPhone}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone
              </Button>
            </div>

            <div>
              <Label>Social Media</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <Input
                      id="whatsapp"
                      value={formData.socialMedia.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, whatsapp: e.target.value } }))}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, facebook: e.target.value } }))}
                    placeholder="facebook.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, instagram: e.target.value } }))}
                    placeholder="instagram.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, twitter: e.target.value } }))}
                    placeholder="twitter.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <Button
                key={amenity._id}
                type="button"
                variant={formData.selectedAmenities.includes(amenity.name) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleAmenity(amenity.name)}
              >
                {amenity.name}
                {formData.selectedAmenities.includes(amenity.name) && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>360° Virtual Tour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="video360Url">360° Video URL</Label>
            <Input
              id="video360Url"
              value={formData.video360Url}
              onChange={(e) => setFormData({ ...formData, video360Url: e.target.value })}
              placeholder="https://example.com/360-tour"
              type="url"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              {property?._id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            property?._id ? 'Update Property' : 'Create Property'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
