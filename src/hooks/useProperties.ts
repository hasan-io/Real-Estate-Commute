import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  price: number;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  amenities: string[];
  description: string | null;
  image_url: string | null;
  commute_duration_mins: number | null;
  commute_distance_km: number | null;
  monthly_commute_cost: number;
  monthly_local_expenses: number;
  lifestyle_scores: any;
  nearby_pois: any;
  is_verified: boolean;
  owner_name: string | null;
  owner_phone: string | null;
  created_at: string;
}

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Property[];
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Property;
    },
    enabled: !!id,
  });
};

export const getMatchPercent = (
  scores: Record<string, number>,
  preference: string | null
): number => {
  if (!scores || Object.keys(scores).length === 0) return 0;
  if (preference && scores[preference] !== undefined) {
    return scores[preference];
  }
  const values = Object.values(scores);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

export const getTrueCost = (property: Property): number => {
  if (property.listing_type === "Sale") return property.price;
  return property.price + property.monthly_commute_cost + property.monthly_local_expenses;
};
