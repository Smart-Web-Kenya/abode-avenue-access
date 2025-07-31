
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  property_type: string;
  year_built?: number;
  parking_spaces?: number;
  featured?: boolean;
  status?: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  coordinates?: { lat: number; lng: number };
  amenities?: string[];
  created_at: string;
  updated_at: string;
  category_id?: string;
  location_id?: string;
}

// Helper function to transform database row to Property interface
const transformProperty = (row: any): Property => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    location: row.location,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    sqft: row.sqft,
    property_type: row.property_type,
    year_built: row.year_built,
    parking_spaces: row.parking_spaces,
    featured: row.featured,
    status: row.status,
    image_url: row.image_url,
    images: Array.isArray(row.images) ? row.images : [],
    video_url: row.video_url,
    coordinates: row.coordinates && typeof row.coordinates === 'object' ? row.coordinates as { lat: number; lng: number } : undefined,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    category_id: row.category_id,
    location_id: row.location_id,
  };
};

export const useProperties = (featured?: boolean) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'Available');

        if (featured) {
          query = query.eq('featured', true);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching properties:', error);
          setError(error.message);
        } else {
          const transformedProperties = (data || []).map(transformProperty);
          setProperties(transformedProperties);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [featured]);

  return { properties, loading, error };
};

export const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching property:', error);
          setError(error.message);
        } else {
          const transformedProperty = data ? transformProperty(data) : null;
          setProperty(transformedProperty);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
};
