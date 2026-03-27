import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { getMatchPercent, getTrueCost, Property } from "@/hooks/useProperties";
import { getPropertyThumbnail } from "@/data/propertyImages";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare, preferences } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (compareList.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("properties")
        .select("*")
        .in("id", compareList);
      setProperties((data as Property[]) || []);
      setLoading(false);
    };
    fetch();
  }, [compareList]);

  const getYearlyDaysLost = (p: Property) => {
    const daily = (p.commute_duration_mins || 0) * 2;
    const monthly = (daily * 26) / 60;
    return Math.round((monthly * 12) / 24);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-light text-architectural mb-4">COMPARE</h1>
                <p className="text-muted-foreground">Side-by-side comparison of selected properties</p>
              </div>
              {compareList.length > 0 && (
                <Button variant="outline" onClick={clearCompare} className="text-minimal">CLEAR ALL</Button>
              )}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No properties selected for comparison.</p>
                <Link to="/properties">
                  <Button variant="outline" className="text-minimal">BROWSE PROPERTIES</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-minimal text-muted-foreground py-4 pr-8 w-40">PROPERTY</th>
                      {properties.map((p) => (
                        <th key={p.id} className="text-left py-4 px-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img
                                src={getPropertyThumbnail(p.property_type)}
                                alt={p.name}
                                className="w-16 h-12 object-cover"
                                loading="lazy"
                              />
                              <div>
                                <Link to={`/property/${p.id}`} className="text-foreground font-light text-lg hover:text-muted-foreground transition-colors">
                                  {p.name}
                                </Link>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" /> {p.location}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => removeFromCompare(p.id)} className="p-1 text-muted-foreground hover:text-foreground">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "PRICE",
                        render: (p: Property) =>
                          p.listing_type === "Sale"
                            ? `Rs.${(p.price / 100000).toFixed(1)}L`
                            : `Rs.${p.price.toLocaleString("en-IN")}/mo`,
                      },
                      {
                        label: "TRUE COST",
                        render: (p: Property) =>
                          p.listing_type === "Sale" ? "-" : `Rs.${getTrueCost(p).toLocaleString("en-IN")}/mo`,
                      },
                      {
                        label: "COMMUTE",
                        render: (p: Property) => p.commute_duration_mins ? `${p.commute_duration_mins} min` : "-",
                      },
                      {
                        label: "YEARLY TIME LOST",
                        render: (p: Property) => `${getYearlyDaysLost(p)} days`,
                      },
                      {
                        label: "MATCH %",
                        render: (p: Property) =>
                          `${getMatchPercent(p.lifestyle_scores as Record<string, number>, preferences.lifestylePreference)}%`,
                      },
                      { label: "TYPE", render: (p: Property) => p.property_type },
                      { label: "BEDROOMS", render: (p: Property) => p.bedrooms ? String(p.bedrooms) : "-" },
                      { label: "AREA", render: (p: Property) => p.area_sqft ? `${p.area_sqft} sqft` : "-" },
                      {
                        label: "AMENITIES COUNT",
                        render: (p: Property) => String(p.amenities?.length || 0),
                      },
                      {
                        label: "AMENITIES",
                        render: (p: Property) => p.amenities?.join(", ") || "-",
                      },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-border">
                        <td className="text-minimal text-muted-foreground py-4 pr-8">{row.label}</td>
                        {properties.map((p) => (
                          <td key={p.id} className="py-4 px-4 text-foreground">{row.render(p)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compare;
