import { Link } from "react-router-dom";
import { useProperties, getMatchPercent, getTrueCost } from "@/hooks/useProperties";
import { useUser } from "@/contexts/UserContext";
import { getPropertyThumbnail } from "@/data/propertyImages";
import { MapPin, Clock } from "lucide-react";

const Portfolio = () => {
  const { data: properties } = useProperties();
  const { preferences } = useUser();

  const featured = properties?.slice(0, 3) || [];

  const formatPrice = (price: number, listing: string) => {
    if (listing === "Sale") {
      if (price >= 10000000) return `Rs.${(price / 10000000).toFixed(1)}Cr`;
      if (price >= 100000) return `Rs.${(price / 100000).toFixed(1)}L`;
      return `Rs.${price.toLocaleString("en-IN")}`;
    }
    return `Rs.${price.toLocaleString("en-IN")}/mo`;
  };

  return (
    <section id="work" className="py-32 bg-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">FEATURED PROPERTIES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Top Picks in Nagpur
            </h3>
          </div>

          <div className="space-y-32">
            {featured.map((property, index) => {
              const matchPercent = getMatchPercent(
                property.lifestyle_scores as Record<string, number>,
                preferences.lifestylePreference
              );
              const trueCost = getTrueCost(property);
              const thumbnail = getPropertyThumbnail(property.property_type);

              return (
                <Link to={`/property/${property.id}`} key={property.id} className="group block">
                  <div className="relative overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={property.name}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="w-full h-[70vh] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5">
                      <span className="text-minimal text-foreground">{property.listing_type}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5">
                      <span className="text-minimal text-foreground">{matchPercent}% MATCH</span>
                    </div>
                  </div>

                  <div className="mt-8 grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-2xl font-light text-architectural mb-2">
                        {property.name}
                      </h4>
                      <p className="text-minimal text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {property.location}
                      </p>
                    </div>

                    <div className="md:col-span-2 flex gap-8 items-start">
                      <div>
                        <p className="text-minimal text-muted-foreground mb-1">RENT</p>
                        <p className="text-foreground">{formatPrice(property.price, property.listing_type)}</p>
                      </div>
                      <div>
                        <p className="text-minimal text-muted-foreground mb-1">TRUE COST</p>
                        <p className="text-foreground">
                          {property.listing_type === "Sale"
                            ? formatPrice(property.price, "Sale")
                            : `Rs.${trueCost.toLocaleString("en-IN")}/mo`}
                        </p>
                      </div>
                      {property.commute_duration_mins && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-sm">{property.commute_duration_mins} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/properties"
              className="inline-block text-minimal text-foreground border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              VIEW ALL PROPERTIES
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
