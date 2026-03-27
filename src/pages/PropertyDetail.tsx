import { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useProperty, getMatchPercent, getTrueCost } from "@/hooks/useProperties";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { getPropertyImages } from "@/data/propertyImages";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Clock, BedDouble, Bath, Maximize,
  CheckCircle2, Navigation as NavIcon, CalendarDays, Timer, Plus, Check,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(15).optional(),
  message: z.string().trim().min(1).max(1000),
});

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id || "");
  const { preferences, compareList, addToCompare, removeFromCompare } = useUser();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground">Property not found.</p>
        </div>
      </div>
    );
  }

  const matchPercent = getMatchPercent(
    property.lifestyle_scores as Record<string, number>,
    preferences.lifestylePreference
  );
  const trueCost = getTrueCost(property);
  const isInCompare = compareList.includes(property.id);
  const images = getPropertyImages(property.property_type);

  // Time impact calculations
  const dailyCommuteMins = (property.commute_duration_mins || 0) * 2;
  const monthlyHours = Math.round((dailyCommuteMins * 26) / 60);
  const yearlyDays = Math.round((monthlyHours * 12) / 24);

  // Color logic for time
  const getTimeColor = (mins: number) => {
    if (mins < 30) return "text-green-600 dark:text-green-400";
    if (mins <= 60) return "text-orange-500 dark:text-orange-400";
    return "text-red-500 dark:text-red-400";
  };

  const commuteColor = getTimeColor(property.commute_duration_mins || 0);

  const handleInquiry = async () => {
    const result = inquirySchema.safeParse(formData);
    if (!result.success) {
      toast({ title: "Please fill all required fields correctly", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      property_id: property.id,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
      role: preferences.role || "user",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit inquiry", variant: "destructive" });
    } else {
      toast({ title: "Inquiry submitted successfully" });
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  const lifestyleLabels: Record<string, string> = {
    quiet: "Quiet & Peaceful",
    family: "Family Oriented",
    cafe: "Cafe & Work Culture",
    fitness: "Fitness & Active",
    nightlife: "Nightlife & Social",
  };

  // Budget comparison
  const budgetDiff = preferences.monthlyBudget - trueCost;
  const isWithinBudget = budgetDiff >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-minimal px-3 py-1 border border-border">{property.listing_type}</span>
                <span className="text-minimal px-3 py-1 border border-border">{property.property_type}</span>
                {property.is_verified && (
                  <span className="flex items-center gap-1 text-minimal text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl md:text-6xl font-light text-architectural mb-4">{property.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => isInCompare ? removeFromCompare(property.id) : addToCompare(property.id)}
                  className={`p-3 border transition-colors duration-300 ${
                    isInCompare ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {isInCompare ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="relative overflow-hidden mb-16 bg-muted h-[50vh]">
              <img
                src={images[currentImage]}
                alt={`${property.name} - Image ${currentImage + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm px-4 py-2">
                <span className="text-minimal text-foreground">{matchPercent}% MATCH</span>
              </div>
              {/* Image navigation */}
              <button
                onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2.5 h-2.5 transition-colors ${
                      i === currentImage ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-20">
              {/* Left column */}
              <div className="md:col-span-2 space-y-16">
                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {property.bedrooms && (
                    <div className="flex items-center gap-3">
                      <BedDouble className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-minimal text-muted-foreground">BEDROOMS</p>
                        <p className="text-lg text-foreground">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-3">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-minimal text-muted-foreground">BATHROOMS</p>
                        <p className="text-lg text-foreground">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.area_sqft && (
                    <div className="flex items-center gap-3">
                      <Maximize className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-minimal text-muted-foreground">AREA</p>
                        <p className="text-lg text-foreground">{property.area_sqft} sqft</p>
                      </div>
                    </div>
                  )}
                  {property.commute_duration_mins != null && (
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${commuteColor}`} />
                      <div>
                        <p className="text-minimal text-muted-foreground">COMMUTE</p>
                        <p className={`text-lg ${commuteColor}`}>{property.commute_duration_mins} min</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-minimal text-muted-foreground mb-4">DESCRIPTION</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h2 className="text-minimal text-muted-foreground mb-4">AMENITIES</h2>
                    <div className="flex flex-wrap gap-3">
                      {property.amenities.map((a) => (
                        <span key={a} className="px-4 py-2 border border-border text-sm text-foreground">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* TRUE COST */}
                <div className="border border-foreground p-8">
                  <h2 className="text-2xl font-light text-architectural mb-8">TRUE COST BREAKDOWN</h2>
                  {property.listing_type !== "Sale" ? (
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="text-foreground">Rs.{property.price.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Monthly Commute Cost</span>
                        <span className="text-foreground">Rs.{property.monthly_commute_cost.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Monthly Local Expenses</span>
                        <span className="text-foreground">Rs.{property.monthly_local_expenses.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-3 text-lg font-medium">
                        <span className="text-foreground">Total Monthly Cost</span>
                        <span className="text-foreground">Rs.{trueCost.toLocaleString("en-IN")}</span>
                      </div>
                      {/* Budget comparison */}
                      {preferences.role === "user" && preferences.monthlyBudget > 0 && (
                        <div className={`mt-4 p-4 ${isWithinBudget ? "bg-muted" : "bg-destructive/10"}`}>
                          <p className="text-minimal text-muted-foreground mb-1">VS YOUR BUDGET</p>
                          {isWithinBudget ? (
                            <p className="text-foreground">
                              Rs.{budgetDiff.toLocaleString("en-IN")} below your budget. You could save this monthly.
                            </p>
                          ) : (
                            <p className="text-destructive">
                              Rs.{Math.abs(budgetDiff).toLocaleString("en-IN")} above your budget.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between py-3 text-lg font-medium">
                      <span className="text-foreground">Purchase Price</span>
                      <span className="text-foreground">
                        Rs.{property.price >= 10000000
                          ? `${(property.price / 10000000).toFixed(1)}Cr`
                          : property.price >= 100000
                          ? `${(property.price / 100000).toFixed(1)}L`
                          : property.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* TIME IMPACT with colors */}
                {property.commute_duration_mins != null && property.commute_duration_mins > 0 && (
                  <div>
                    <h2 className="text-minimal text-muted-foreground mb-6">TIME IMPACT</h2>
                    <div className="grid grid-cols-3 gap-8">
                      <div className="border border-border p-6 text-center">
                        <Timer className={`w-5 h-5 mx-auto mb-3 ${commuteColor}`} />
                        <p className={`text-2xl font-light mb-1 ${commuteColor}`}>{dailyCommuteMins} min</p>
                        <p className="text-minimal text-muted-foreground">DAILY COMMUTE</p>
                      </div>
                      <div className="border border-border p-6 text-center">
                        <CalendarDays className={`w-5 h-5 mx-auto mb-3 ${commuteColor}`} />
                        <p className={`text-2xl font-light mb-1 ${commuteColor}`}>{monthlyHours} hrs</p>
                        <p className="text-minimal text-muted-foreground">MONTHLY HOURS</p>
                      </div>
                      <div className="border border-border p-6 text-center">
                        <NavIcon className={`w-5 h-5 mx-auto mb-3 ${commuteColor}`} />
                        <p className={`text-2xl font-light mb-1 ${commuteColor}`}>{yearlyDays} days</p>
                        <p className="text-minimal text-muted-foreground">YEARLY DAYS</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* LIFESTYLE MATCH */}
                <div>
                  <h2 className="text-minimal text-muted-foreground mb-6">LIFESTYLE MATCH</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-border">
                      <span className="text-foreground">PropScore</span>
                      <span className="text-2xl font-light text-foreground">{matchPercent}%</span>
                    </div>
                    {preferences.lifestylePreference && (
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-muted-foreground">Your Preference</span>
                        <span className="text-foreground">
                          {lifestyleLabels[preferences.lifestylePreference] || preferences.lifestylePreference}
                        </span>
                      </div>
                    )}
                    {property.lifestyle_scores && Object.entries(property.lifestyle_scores as Record<string, number>).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">{lifestyleLabels[key] || key}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-muted">
                              <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${value}%` }} />
                            </div>
                            <span className="text-sm text-foreground w-8 text-right">{value}%</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Nearby POIs */}
                {property.nearby_pois && (property.nearby_pois as any[]).length > 0 && (
                  <div>
                    <h2 className="text-minimal text-muted-foreground mb-4">NEARBY PLACES</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {(property.nearby_pois as any[]).map((poi: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-3 border-b border-border">
                          <div>
                            <p className="text-foreground">{poi.name}</p>
                            <p className="text-minimal text-muted-foreground">{poi.type}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{poi.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - inquiry form */}
              <div>
                <div className="sticky top-28 space-y-8">
                  <div className="border border-border p-8">
                    <h3 className="text-xl font-light text-architectural mb-6">Interested in this property?</h3>
                    <div className="space-y-4">
                      <Input placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      <Input placeholder="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      <Input placeholder="Phone (optional)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      <Textarea placeholder="Your message..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} />
                      <Button onClick={handleInquiry} disabled={submitting} className="w-full">
                        {submitting ? "Submitting..." : "Send Inquiry"}
                      </Button>
                    </div>
                  </div>

                  {property.owner_name && (
                    <div className="border border-border p-6">
                      <p className="text-minimal text-muted-foreground mb-2">LISTED BY</p>
                      <p className="text-foreground">{property.owner_name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;
