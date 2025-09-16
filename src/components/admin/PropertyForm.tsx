import { useState, useRef, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Image as ImageIcon, Phone, MessageCircle } from 'lucide-react';
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

const PropertyForm = ({ onClose, property, onSave }: PropertyFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
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
    selectedAmenities: property?.selectedAmenities || [] as string[],
    location: {
      country: property?.location?.country || 'Kenya',
      city: property?.location?.city || '',
      area: property?.location?.area || '',
      subArea: property?.location?.subArea || ''
    },
    category: property?.category?._id || property?.category || ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

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

  const validatePhoneNumber = (phone: string): boolean => {
    // Kenyan phone number format: +254XXXXXXXXX or 07XXXXXXXX or 7XXXXXXXX
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
    // Remove any non-digit characters
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log('Selected files:', files);
    const formData = new FormData();
    
    // Append each file to formData
    Array.from(files).forEach((file, index) => {
      console.log(`Appending file ${index}:`, file.name, 'Size:', file.size, 'Type:', file.type);
      formData.append('images', file);
    });

    try {
      setIsUploading(true);
      console.log('Uploading files to server...');
      
      // Add withCredentials if using sessions/cookies
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Include this if using sessions
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      };

      console.log('Sending FormData with files:', Array.from(formData.entries()));
      
      const response = await axios.post(
        'http://127.0.0.1:3000/api/v1/properties/upload', 
        formData, 
        config
      );

      console.log('Upload response:', response.data);
       
      if (response.data.success && Array.isArray(response.data.images)) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...response.data.images]
        }));

        toast({
          title: 'Success',
          description: `${files.length} image(s) uploaded successfully`,
          variant: 'default',
        });
      } else {
        throw new Error(response.data.message || 'Failed to upload images: Invalid response format');
      }
    } catch (error) {
      console.error('Error uploading images:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      // Log the actual error from server if available
      if (error.response?.data?.error) {
        console.error('Server error details:', error.response.data.error);
      }
      
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'Failed to upload images. Please check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = formData.images[index];
    
    try {
      await axios.delete(`/api/v1/properties/image/${imageToRemove.public_id}`);
      
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      
      toast({
        title: 'Success',
        description: 'Image removed successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove image',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate phone numbers
      const invalidPhones = formData.contactPhones
        .map((phone, index) => ({
          index,
          valid: validatePhoneNumber(phone),
          value: phone
        }))
        .filter(item => !item.valid);

      if (invalidPhones.length > 0) {
        const errorMessage = `Invalid phone number format at position ${invalidPhones[0].index + 1}. ` +
          'Please use a valid Kenyan phone number (e.g., 0712345678 or 712345678)';
        
        toast({
          title: 'Validation Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }

      // Rest of your validation and submission logic
      const requiredFields = ['title', 'description', 'bedrooms', 'bathrooms', 'sqft', 'yearBuilt', 'category'];
      const missingFields = requiredFields.filter(field => {
        if (field === 'bedrooms' || field === 'bathrooms' || field === 'sqft' || field === 'yearBuilt') {
          return formData[field] === '' || formData[field] === undefined;
        }
        return !formData[field];
      });

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
        yearBuilt: Number(formData.yearBuilt),
        // Ensure arrays are properly formatted
        contactPhones: formData.contactPhones.filter(phone => phone.trim() !== ''),
        selectedAmenities: formData.selectedAmenities.filter(amenity => amenity.trim() !== '')
      };

      console.log('Submitting property data:', JSON.stringify(propertyData, null, 2));
      
      let response;
      if (property?._id) {
        response = await axios.put(
          `http://127.0.0.1:3000/api/v1/properties/${property._id}`, 
          propertyData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          'http://127.0.0.1:3000/api/v1/properties', 
          propertyData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      console.log('Property saved successfully:', response.data);
      
      toast({
        title: 'Success',
        description: `Property ${property?._id ? 'updated' : 'created'} successfully`,
        variant: 'default',
      });

      if (onSave) {
        onSave(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving property:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to save property. Please check the console for details.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await axios.get('http://127.0.0.1:3000/api/v1/categories');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              onChange={(e) => setFormData({...formData, price: e.target.value})}
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
              onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
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
              onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
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
              onChange={(e) => setFormData({...formData, sqft: e.target.value})}
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
              onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
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
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Describe the property in detail..."
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Property Category *</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCategories ? (
            <div>Loading categories...</div>
          ) : (
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
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
          )}
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.location.country}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, country: e.target.value }
              })}
              placeholder="Country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.location.city}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, city: e.target.value }
              })}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              value={formData.location.area}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, area: e.target.value }
              })}
              placeholder="Area/Neighborhood"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subArea">Sub Area</Label>
            <Input
              id="subArea"
              value={formData.location.subArea}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, subArea: e.target.value }
              })}
              placeholder="Sub Area (Optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {formData.images.map((img, index) => (
                <div key={img.public_id || index} className="relative group">
                  <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                    <img 
                      src={img.url} 
                      alt={`Property ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
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
              
              <div 
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-green"></div>
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
                  placeholder="facebook.com/username"
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
                  placeholder="instagram.com/username"
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
                  placeholder="twitter.com/username"
                />
              </div>
            </div>
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
              <Button
                key={amenity}
                type="button"
                variant={formData.selectedAmenities.includes(amenity) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
                {formData.selectedAmenities.includes(amenity) && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 360° Video URL */}
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
              onChange={(e) => setFormData({...formData, video360Url: e.target.value})}
              placeholder="https://example.com/360-tour"
              type="url"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          {property?._id ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
