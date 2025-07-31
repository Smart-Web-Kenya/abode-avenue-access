
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  sqft INTEGER NOT NULL,
  property_type TEXT NOT NULL,
  year_built INTEGER,
  parking_spaces INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Available',
  image_url TEXT,
  images JSONB DEFAULT '[]',
  video_url TEXT,
  coordinates JSONB,
  amenities JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create locations table  
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create amenities table
CREATE TABLE public.amenities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add property_category relationship
ALTER TABLE public.properties ADD COLUMN category_id UUID REFERENCES public.categories(id);
ALTER TABLE public.properties ADD COLUMN location_id UUID REFERENCES public.locations(id);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public real estate site)
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Anyone can view amenities" ON public.amenities FOR SELECT USING (true);

-- Insert sample data
INSERT INTO public.categories (name, description) VALUES 
('Apartment', 'Modern apartment units'),
('House', 'Single family homes'),
('Condo', 'Condominium units'),
('Townhouse', 'Multi-level townhouses'),
('Studio', 'Studio apartments'),
('Penthouse', 'Luxury penthouse units'),
('Maisonette', 'Multi-level apartments'),
('Bungalow', 'Single-story homes');

INSERT INTO public.locations (name, description) VALUES 
('Downtown District', 'Urban downtown area'),
('Suburban Hills', 'Quiet suburban neighborhood'),
('Arts Quarter', 'Cultural arts district'),
('Riverside', 'Waterfront properties'),
('City Center', 'Central business district'),
('Green Valley', 'Scenic valley location'),
('Westlands', 'Premium Westlands area'),
('Karen', 'Upscale Karen neighborhood'),
('Runda', 'Exclusive Runda estate');

INSERT INTO public.amenities (name, icon) VALUES 
('WiFi Included', 'Wifi'),
('Fitness Center', 'Dumbbell'),
('Secure Building', 'Shield'),
('Rooftop Garden', 'Trees'),
('Parking Space', 'Car'),
('Swimming Pool', 'Waves'),
('Gym', 'Dumbbell'),
('Security', 'Shield');

-- Insert sample properties
INSERT INTO public.properties (
  title, description, price, location, bedrooms, bathrooms, sqft, property_type, 
  year_built, parking_spaces, featured, status, image_url, images, video_url,
  coordinates, amenities, category_id, location_id
)
SELECT 
  'Modern Downtown Loft',
  'Experience urban luxury in this stunning downtown loft featuring floor-to-ceiling windows, hardwood floors, and modern finishes throughout.',
  450000,
  'Downtown District, 123 Main Street',
  2, 2, 1200, 'Apartment', 2020, 1, true, 'Available',
  'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop", "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200&h=800&fit=crop"]',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  '{"lat": 40.7128, "lng": -74.0060}',
  '["WiFi Included", "Fitness Center", "Secure Building", "Parking Space"]',
  c.id, l.id
FROM public.categories c, public.locations l 
WHERE c.name = 'Apartment' AND l.name = 'Downtown District';
