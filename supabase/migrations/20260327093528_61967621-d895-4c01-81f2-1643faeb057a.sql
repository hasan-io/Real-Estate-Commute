
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Nagpur',
  price NUMERIC NOT NULL,
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL DEFAULT 'Rent',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  amenities TEXT[] DEFAULT '{}',
  description TEXT,
  image_url TEXT,
  commute_duration_mins INTEGER,
  commute_distance_km NUMERIC,
  monthly_commute_cost NUMERIC DEFAULT 0,
  monthly_local_expenses NUMERIC DEFAULT 0,
  lifestyle_scores JSONB DEFAULT '{}',
  nearby_pois JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  owner_name TEXT,
  owner_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Properties are publicly readable
CREATE POLICY "Properties are publicly readable"
  ON public.properties FOR SELECT USING (true);

-- Anyone can submit inquiries
CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries FOR INSERT WITH CHECK (true);

-- Inquiries are publicly readable
CREATE POLICY "Inquiries are publicly readable"
  ON public.inquiries FOR SELECT USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
