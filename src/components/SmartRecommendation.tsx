import { Link } from "react-router-dom";
import { useProperties, getMatchPercent, getTrueCost, Property } from "@/hooks/useProperties";
import { useUser } from "@/contexts/UserContext";
import { Star, IndianRupee, Clock, Heart } from "lucide-react";
import { getPropertyThumbnail } from "@/data/propertyImages";

const SmartRecommendation = () => {
  const { data: properties } = useProperties();
  const { preferences } = useUser();

  if (!properties || properties.length === 0 || preferences.role !== "user") return null;

  const rentalProperties = properties.filter((p) => p.listing_type !== "Sale");
  if (rentalProperties.length === 0) return null;

  // Calculate weighted score: 40% cost, 35% commute, 25% lifestyle
  const maxPrice = Math.max(...rentalProperties.map((p) => getTrueCost(p)));
  const maxCommute = Math.max(...rentalProperties.map((p) => p.commute_duration_mins || 60));

  const scored = rentalProperties.map((p) => {
    const trueCost = getTrueCost(p);
    const match = getMatchPercent(
      p.lifestyle_scores as Record<string, number>,
      preferences.lifestylePreference
    );
    const costScore = maxPrice > 0 ? (1 - trueCost / maxPrice) * 100 : 50;
    const commuteScore = maxCommute > 0 ? (1 - (p.commute_duration_mins || 0) / maxCommute) * 100 : 50;

    const weightedScore = costScore * 0.4 + commuteScore * 0.35 + match * 0.25;

    return { property: p, score: Math.round(weightedScore), trueCost, match, costScore, commuteScore };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return null;

  const reasons = [];

  // Cost reason
  const avgCost = rentalProperties.reduce((s, p) => s + getTrueCost(p), 0) / rentalProperties.length;
  if (best.trueCost < avgCost) {
    reasons.push({
      icon: IndianRupee,
      text: `Saves Rs.${Math.round(avgCost - best.trueCost).toLocaleString("en-IN")}/mo vs average`,
    });
  }

  // Commute reason
  const avgCommute = rentalProperties.reduce((s, p) => s + (p.commute_duration_mins || 0), 0) / rentalProperties.length;
  if ((best.property.commute_duration_mins || 0) < avgCommute) {
    const savedMins = Math.round(avgCommute - (best.property.commute_duration_mins || 0));
    reasons.push({
      icon: Clock,
      text: `${savedMins} min shorter commute than average`,
    });
  }

  // Lifestyle reason
  if (best.match >= 70) {
    reasons.push({
      icon: Heart,
      text: `${best.match}% lifestyle match for your preferences`,
    });
  }

  const thumbnail = getPropertyThumbnail(best.property.property_type);

  return (
    <div className="border border-foreground p-8">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-foreground" />
        <h3 className="text-xl font-light text-architectural">SMART RECOMMENDATION</h3>
      </div>

      <Link to={`/property/${best.property.id}`} className="group block">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="overflow-hidden bg-muted h-48">
            <img
              src={thumbnail}
              alt={best.property.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:col-span-2">
            <h4 className="text-2xl font-light text-architectural mb-2 group-hover:text-muted-foreground transition-colors">
              {best.property.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">{best.property.location}</p>
            <div className="flex gap-6 mb-6">
              <div>
                <p className="text-minimal text-muted-foreground mb-1">TRUE COST</p>
                <p className="text-foreground font-medium">Rs.{best.trueCost.toLocaleString("en-IN")}/mo</p>
              </div>
              <div>
                <p className="text-minimal text-muted-foreground mb-1">SCORE</p>
                <p className="text-foreground font-medium">{best.score}/100</p>
              </div>
            </div>
            <div className="space-y-2">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <r.icon className="w-3.5 h-3.5" />
                  <span>{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmartRecommendation;
