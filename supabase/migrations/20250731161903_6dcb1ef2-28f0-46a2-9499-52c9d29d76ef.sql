
-- Add global contact information fields to properties table
ALTER TABLE public.properties 
ADD COLUMN contact_name TEXT DEFAULT 'Prime Properties Team',
ADD COLUMN contact_email TEXT DEFAULT 'info@primeproperties.com',
ADD COLUMN contact_phone TEXT DEFAULT '+1 (555) 123-4567',
ADD COLUMN contact_whatsapp TEXT,
ADD COLUMN agent_name TEXT,
ADD COLUMN agent_email TEXT,
ADD COLUMN agent_phone TEXT,
ADD COLUMN agent_image TEXT;

-- Update existing properties with sample contact data
UPDATE public.properties 
SET 
  contact_name = 'Prime Properties Team',
  contact_email = 'info@primeproperties.com', 
  contact_phone = '+1 (555) 123-4567',
  contact_whatsapp = '+1 (555) 123-4567',
  agent_name = 'Sarah Johnson',
  agent_email = 'sarah@primeproperties.com',
  agent_phone = '+1 (555) 987-6543',
  agent_image = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=200&fit=crop&crop=face';
