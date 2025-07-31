
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
          setProperties(data || []);
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
          setProperty(data);
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
