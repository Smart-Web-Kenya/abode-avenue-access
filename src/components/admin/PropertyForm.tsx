
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Phone, MessageCircle } from 'lucide-react';

interface PropertyFormProps {
  onClose: () => void;
  property?: any; // Optional property for editing
}

const PropertyForm = ({ onClose, property }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    price: property?.price || '',
    description: property?.description || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    sqft: property?.sqft || '',
    yearBuilt: property?.yearBuilt || '',
    video360Url: property?.video360Url || '',
    images: property?.images || [] as string[],
    contactPhones: property?.contactPhones || [''],
    socialMedia: {
      facebook: property?.socialMedia?.facebook || '',
      instagram: property?.socialMedia?.instagram || '',
      twitter: property?.socialMedia?.twitter || '',
      whatsapp: property?.socialMedia?.whatsapp || ''
    },
    selectedAmenities: property?.selectedAmenities || [] as string[],
    location: {
      country: property?.location?.country || 'Kenya',
      city: property?.location?.city || '',
      area: property?.location?.area || '',
      subArea: property?.location?.subArea || ''
    },
    category: property?.category || ''
  });

  const mockAmenities = [
    'WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden',
    'Balcony', 'Air Conditioning', 'Elevator', 'Generator'
  ];

  const mockLocations = {
    Kenya: {
      Nairobi: {
        Westlands: ['Parklands', 'Kangemi', 'Mountain View'],
        Karen: ['Karen C', 'Langata', 'Hardy'],
        Embakasi: ['Umoja', 'Kayole', 'Dandora']
      },
      Mombasa: {
        'Mombasa Island': ['Old Town', 'Ganjoni', 'Majengo'],
        Likoni: ['Shika Adabu', 'Mtongwe', 'Timbwani']
      }
    }
  };

  const categories = [
    'Maisonette', 'Bungalow', '1 Bedroom', '2 Bedroom', '3 Bedroom', 
    '4 Bedroom', 'Studio', 'Bedsitter', 'Penthouse'
  ];

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
    setFormData(prev => ({
      ...prev,
      contactPhones: prev.contactPhones.map((phone, i) => i === index ? value : phone)
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

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Modern Downtown Loft"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (Ksh)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="450000"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the property..."
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData(prev => ({ ...prev, sqft: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="video360">360° Video URL</Label>
            <Input
              id="video360"
              value={formData.video360Url}
              onChange={(e) => setFormData(prev => ({ ...prev, video360Url: e.target.value }))}
              placeholder="https://example.com/360-video"
            />
          </div>
          <div>
            <Label>Property Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Drag & drop images here or click to browse</p>
              <Button variant="outline" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Contact Phone Numbers</Label>
            {formData.contactPhones.map((phone, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <Input
                  value={phone}
                  onChange={(e) => updateContactPhone(index, e.target.value)}
                  placeholder="+254 712 345 678"
                  className="flex-1"
                />
                {formData.contactPhones.length > 1 && (
                  <Button
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
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <Input
                    id="whatsapp"
                    value={formData.socialMedia.whatsapp}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, whatsapp: e.target.value }
                    }))}
                    placeholder="+254 712 345 678"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                  }))}
                  placeholder="Facebook profile/page"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                  }))}
                  placeholder="Instagram handle"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                  }))}
                  placeholder="Twitter handle"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.location.country}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, country: e.target.value }
                }))}
              >
                <option value="Kenya">Kenya</option>
              </select>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.location.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value }
                }))}
              >
                <option value="">Select City</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
              </select>
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <select
                id="area"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.location.area}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, area: e.target.value }
                }))}
              >
                <option value="">Select Area</option>
                {formData.location.city === 'Nairobi' && (
                  <>
                    <option value="Westlands">Westlands</option>
                    <option value="Karen">Karen</option>
                    <option value="Embakasi">Embakasi</option>
                  </>
                )}
                {formData.location.city === 'Mombasa' && (
                  <>
                    <option value="Mombasa Island">Mombasa Island</option>
                    <option value="Likoni">Likoni</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <Label htmlFor="subArea">Sub Area</Label>
              <select
                id="subArea"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.location.subArea}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, subArea: e.target.value }
                }))}
              >
                <option value="">Select Sub Area</option>
                {formData.location.area === 'Embakasi' && (
                  <>
                    <option value="Umoja">Umoja</option>
                    <option value="Kayole">Kayole</option>
                    <option value="Dandora">Dandora</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle>Property Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category }))}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  formData.category === category
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockAmenities.map((amenity) => (
              <Badge
                key={amenity}
                variant="outline"
                className={`cursor-pointer ${
                  formData.selectedAmenities.includes(amenity)
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-teal-600 hover:bg-teal-700">
          Save Property
        </Button>
      </div>
    </div>
  );
};

export default PropertyForm;
