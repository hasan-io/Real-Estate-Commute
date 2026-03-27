import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardCards from "@/components/DashboardCards";
import SmartRecommendation from "@/components/SmartRecommendation";
import { useProperties, getMatchPercent, getTrueCost } from "@/hooks/useProperties";
import { useUser } from "@/contexts/UserContext";
import { getPropertyThumbnail } from "@/data/propertyImages";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Clock, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Properties = () => {
  const { data: properties, isLoading } = useProperties();
  const { preferences, compareList, addToCompare, removeFromCompare } = useUser();
  const [searchParams] = useSearchParams();

  const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "ALL");
  const [listingFilter, setListingFilter] = useState(searchParams.get("listing") || "ALL");
  const [budgetRange, setBudgetRange] = useState([
    searchParams.get("budget") ? parseInt(searchParams.get("budget")!) : 100000,
  ]);

  const propertyTypes = ["ALL", "Apartment", "Villa", "PG", "Studio", "Independent House"];
  const listingTypes = ["ALL", "Rent", "Sale", "PG"];

  const filtered = useMemo(() => {
    if (!properties) return [];
    return properties.filter((p) => {
      if (searchLocation && !p.location.toLowerCase().includes(searchLocation.toLowerCase())) return false;
      if (typeFilter !== "ALL" && p.property_type !== typeFilter) return false;
      if (listingFilter !== "ALL" && p.listing_type !== listingFilter) return false;
      if (p.listing_type !== "Sale" && p.price > budgetRange[0]) return false;
      return true;
    });
  }, [properties, searchLocation, typeFilter, listingFilter, budgetRange]);

  const formatPrice = (price: number, listing: string) => {
    if (listing === "Sale") {
      if (price >= 10000000) return `Rs.${(price / 10000000).toFixed(1)}Cr`;
      if (price >= 100000) return `Rs.${(price / 100000).toFixed(1)}L`;
      return `Rs.${price.toLocaleString("en-IN")}`;
    }
    return `Rs.${price.toLocaleString("en-IN")}/mo`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-light text-architectural mb-4">
                PROPERTIES
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Discover your ideal property in Nagpur with true cost transparency.
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="mb-12">
              <DashboardCards />
            </div>

            {/* Smart Recommendation */}
            <div className="mb-12">
              <SmartRecommendation />
            </div>

            {/* Filters */}
            <div className="space-y-6 mb-16 p-8 border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search by location..."
                    className="pl-10"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-minimal text-muted-foreground">MAX BUDGET</span>
                    <span className="text-sm text-foreground">Rs.{budgetRange[0].toLocaleString("en-IN")}</span>
                  </div>
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    min={5000}
                    max={100000}
                    step={1000}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="text-minimal text-muted-foreground block mb-3">TYPE</span>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`text-minimal px-3 py-1.5 border transition-colors duration-300 ${
                          typeFilter === t
                            ? "border-foreground text-foreground"
                            : "border-border text-muted-foreground hover:border-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-minimal text-muted-foreground block mb-3">LISTING</span>
                  <div className="flex flex-wrap gap-2">
                    {listingTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setListingFilter(t)}
                        className={`text-minimal px-3 py-1.5 border transition-colors duration-300 ${
                          listingFilter === t
                            ? "border-foreground text-foreground"
                            : "border-border text-muted-foreground hover:border-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {compareList.length > 0 && (
              <div className="mb-8 p-4 border border-foreground flex items-center justify-between">
                <span className="text-minimal text-foreground">
                  {compareList.length} PROPERTIES SELECTED FOR COMPARISON
                </span>
                <Link to="/compare">
                  <Button variant="outline" size="sm" className="text-minimal">
                    COMPARE NOW
                  </Button>
                </Link>
              </div>
            )}

            {/* Properties Grid */}
            {isLoading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-2">No properties match your filters.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((property, idx) => {
                  const matchPercent = getMatchPercent(
                    property.lifestyle_scores as Record<string, number>,
                    preferences.lifestylePreference
                  );
                  const trueCost = getTrueCost(property);
                  const isInCompare = compareList.includes(property.id);
                  const thumbnail = getPropertyThumbnail(property.property_type);

                  return (
                    <div key={property.id} className="group">
                      <Link to={`/property/${property.id}`}>
                        <div className="relative overflow-hidden mb-4 bg-muted aspect-[4/3]">
                          <img
                            src={thumbnail}
                            alt={property.name}
                            loading="lazy"
                            width={1024}
                            height={768}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1">
                            <span className="text-minimal text-foreground">{property.listing_type}</span>
                          </div>
                          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1">
                            <span className="text-minimal text-foreground">{matchPercent}% MATCH</span>
                          </div>
                        </div>
                      </Link>

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <Link to={`/property/${property.id}`}>
                            <h3 className="text-lg font-light text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                              {property.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() =>
                              isInCompare ? removeFromCompare(property.id) : addToCompare(property.id)
                            }
                            className={`p-1.5 border transition-colors duration-300 ${
                              isInCompare
                                ? "border-foreground bg-foreground text-background"
                                : "border-border text-muted-foreground hover:border-foreground"
                            }`}
                          >
                            {isInCompare ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-sm">{property.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {property.amenities?.slice(0, 3).map((a) => (
                            <span key={a} className="text-xs px-2 py-0.5 border border-border text-muted-foreground">
                              {a}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-6 pt-3 border-t border-border">
                          <div>
                            <p className="text-minimal text-muted-foreground mb-0.5">RENT</p>
                            <p className="text-foreground text-sm font-medium">
                              {formatPrice(property.price, property.listing_type)}
                            </p>
                          </div>
                          <div>
                            <p className="text-minimal text-muted-foreground mb-0.5">TRUE COST</p>
                            <p className="text-foreground text-sm font-medium">
                              {property.listing_type === "Sale"
                                ? formatPrice(property.price, "Sale")
                                : `Rs.${trueCost.toLocaleString("en-IN")}/mo`}
                            </p>
                          </div>
                          {property.commute_duration_mins && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{property.commute_duration_mins} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;
