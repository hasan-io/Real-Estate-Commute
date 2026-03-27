import { useProperties, getMatchPercent, getTrueCost } from "@/hooks/useProperties";
import { useUser } from "@/contexts/UserContext";
import { Clock, IndianRupee, BarChart3, Building2, TrendingUp, TrendingDown } from "lucide-react";

const DashboardCards = () => {
  const { data: properties } = useProperties();
  const { preferences } = useUser();

  if (!properties || properties.length === 0) return null;

  const rentalProperties = properties.filter((p) => p.listing_type !== "Sale");

  const avgCommute = rentalProperties.length > 0
    ? Math.round(
        rentalProperties.reduce((sum, p) => sum + (p.commute_duration_mins || 0), 0) /
          rentalProperties.length
      )
    : 0;

  const avgPrice = rentalProperties.length > 0
    ? Math.round(
        rentalProperties.reduce((sum, p) => sum + p.price, 0) / rentalProperties.length
      )
    : 0;

  const matchingCount = properties.filter((p) => {
    const match = getMatchPercent(
      p.lifestyle_scores as Record<string, number>,
      preferences.lifestylePreference
    );
    return match >= 70;
  }).length;

  const matchPercent = properties.length > 0
    ? Math.round((matchingCount / properties.length) * 100)
    : 0;

  // Budget insight
  const budgetStatus = avgPrice <= preferences.monthlyBudget;
  const budgetDiff = Math.abs(preferences.monthlyBudget - avgPrice);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-border p-6">
          <Clock className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-2xl font-light text-foreground">{avgCommute} min</p>
          <p className="text-minimal text-muted-foreground mt-1">AVG COMMUTE</p>
        </div>
        <div className="border border-border p-6">
          <IndianRupee className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-2xl font-light text-foreground">Rs.{avgPrice.toLocaleString("en-IN")}</p>
          <p className="text-minimal text-muted-foreground mt-1">AVG RENT</p>
        </div>
        <div className="border border-border p-6">
          <BarChart3 className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-2xl font-light text-foreground">{matchPercent}%</p>
          <p className="text-minimal text-muted-foreground mt-1">MATCHING</p>
        </div>
        <div className="border border-border p-6">
          <Building2 className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-2xl font-light text-foreground">{properties.length}</p>
          <p className="text-minimal text-muted-foreground mt-1">TOTAL LISTINGS</p>
        </div>
      </div>

      {/* Budget Insight */}
      {preferences.role === "user" && preferences.monthlyBudget > 0 && (
        <div className={`border p-6 flex items-center gap-4 ${budgetStatus ? "border-border" : "border-destructive"}`}>
          {budgetStatus ? (
            <TrendingDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          ) : (
            <TrendingUp className="w-5 h-5 text-destructive flex-shrink-0" />
          )}
          <div>
            <p className="text-minimal text-muted-foreground mb-1">BUDGET INSIGHT</p>
            {budgetStatus ? (
              <p className="text-foreground">
                Average rent is Rs.{budgetDiff.toLocaleString("en-IN")} below your budget.
                You could save on housing costs.
              </p>
            ) : (
              <p className="text-foreground">
                Average rent exceeds your budget by Rs.{budgetDiff.toLocaleString("en-IN")}.
                Consider adjusting filters or expanding your search area.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
