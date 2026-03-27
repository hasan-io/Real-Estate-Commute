import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/hooks/useProperties";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Building2, Eye, MessageSquare, List, Plus, Trash2, LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Tab = "overview" | "listings" | "add" | "inquiries";

const Dashboard = () => {
  const { preferences } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add property form state
  const [form, setForm] = useState({
    name: "", location: "", price: "", property_type: "Apartment",
    listing_type: "Rent", bedrooms: "", bathrooms: "", area_sqft: "",
    description: "", amenities: "", owner_name: "", owner_phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preferences.role !== "broker" && preferences.role !== "owner") {
      navigate("/");
      return;
    }
    fetchData();
  }, [preferences.role]);

  const fetchData = async () => {
    setLoading(true);
    const [propRes, inqRes] = await Promise.all([
      supabase.from("properties").select("*").order("created_at", { ascending: false }),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    ]);
    setProperties((propRes.data as Property[]) || []);
    setInquiries(inqRes.data || []);
    setLoading(false);
  };

  const handleAddProperty = async () => {
    if (!form.name || !form.location || !form.price) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    // Auto-generate lifestyle scores
    const lifestyleScores = {
      quiet: Math.floor(Math.random() * 40) + 40,
      family: Math.floor(Math.random() * 40) + 40,
      cafe: Math.floor(Math.random() * 40) + 30,
      fitness: Math.floor(Math.random() * 40) + 30,
      nightlife: Math.floor(Math.random() * 40) + 20,
    };

    // Auto commute estimate
    const commuteMins = Math.floor(Math.random() * 40) + 10;
    const commuteKm = Math.round(commuteMins * 0.5 * 10) / 10;
    const commuteCost = Math.round(commuteMins * 50);
    const localExpenses = Math.round(Math.random() * 3000) + 1000;

    const { error } = await supabase.from("properties").insert({
      name: form.name,
      location: form.location,
      price: parseFloat(form.price),
      property_type: form.property_type,
      listing_type: form.listing_type,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      area_sqft: form.area_sqft ? parseInt(form.area_sqft) : null,
      description: form.description || null,
      amenities: form.amenities ? form.amenities.split(",").map((a) => a.trim()) : [],
      owner_name: form.owner_name || null,
      owner_phone: form.owner_phone || null,
      lifestyle_scores: lifestyleScores,
      commute_duration_mins: commuteMins,
      commute_distance_km: commuteKm,
      monthly_commute_cost: commuteCost,
      monthly_local_expenses: localExpenses,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Failed to add property", variant: "destructive" });
    } else {
      toast({ title: "Property added successfully" });
      setForm({
        name: "", location: "", price: "", property_type: "Apartment",
        listing_type: "Rent", bedrooms: "", bathrooms: "", area_sqft: "",
        description: "", amenities: "", owner_name: "", owner_phone: "",
      });
      fetchData();
      setTab("listings");
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "OVERVIEW", icon: LayoutDashboard },
    { key: "listings", label: "MY LISTINGS", icon: List },
    { key: "add", label: "ADD PROPERTY", icon: Plus },
    { key: "inquiries", label: "INQUIRIES", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-light text-architectural mb-4">
                DASHBOARD
              </h1>
              <p className="text-muted-foreground">
                Manage your properties and inquiries
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-12 border-b border-border pb-4">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 text-minimal px-4 py-2 border transition-colors duration-300 ${
                    tab === t.key
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <>
                {/* Overview */}
                {tab === "overview" && (
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="border border-border p-8">
                      <Building2 className="w-6 h-6 text-muted-foreground mb-4" />
                      <p className="text-3xl font-light text-foreground mb-2">{properties.length}</p>
                      <p className="text-minimal text-muted-foreground">TOTAL LISTINGS</p>
                    </div>
                    <div className="border border-border p-8">
                      <Eye className="w-6 h-6 text-muted-foreground mb-4" />
                      <p className="text-3xl font-light text-foreground mb-2">{properties.length * 12}</p>
                      <p className="text-minimal text-muted-foreground">TOTAL VIEWS</p>
                    </div>
                    <div className="border border-border p-8">
                      <MessageSquare className="w-6 h-6 text-muted-foreground mb-4" />
                      <p className="text-3xl font-light text-foreground mb-2">{inquiries.length}</p>
                      <p className="text-minimal text-muted-foreground">TOTAL INQUIRIES</p>
                    </div>
                  </div>
                )}

                {/* My Listings */}
                {tab === "listings" && (
                  <div>
                    {properties.length === 0 ? (
                      <div className="text-center py-20">
                        <Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground mb-4">No listings yet.</p>
                        <Button variant="outline" onClick={() => setTab("add")} className="text-minimal">
                          ADD YOUR FIRST PROPERTY
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left text-minimal text-muted-foreground py-3">NAME</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">LOCATION</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">TYPE</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">PRICE</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {properties.map((p) => (
                              <tr key={p.id} className="border-b border-border">
                                <td className="py-4">
                                  <Link to={`/property/${p.id}`} className="text-foreground hover:text-muted-foreground transition-colors">
                                    {p.name}
                                  </Link>
                                </td>
                                <td className="py-4 text-muted-foreground text-sm">{p.location}</td>
                                <td className="py-4 text-muted-foreground text-sm">{p.property_type}</td>
                                <td className="py-4 text-foreground">Rs.{p.price.toLocaleString("en-IN")}</td>
                                <td className="py-4">
                                  <Link to={`/property/${p.id}`}>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Property */}
                {tab === "add" && (
                  <div className="max-w-2xl">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">PROPERTY NAME *</label>
                          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Sunrise Apartments" />
                        </div>
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">LOCATION *</label>
                          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Dharampeth, Nagpur" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">PRICE *</label>
                          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Monthly rent" />
                        </div>
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">TYPE</label>
                          <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="Villa">Villa</SelectItem>
                              <SelectItem value="PG">PG</SelectItem>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="Independent House">Independent House</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">LISTING</label>
                          <Select value={form.listing_type} onValueChange={(v) => setForm({ ...form, listing_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rent">Rent</SelectItem>
                              <SelectItem value="Sale">Sale</SelectItem>
                              <SelectItem value="PG">PG</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">BEDROOMS</label>
                          <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">BATHROOMS</label>
                          <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">AREA (SQFT)</label>
                          <Input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="text-minimal text-muted-foreground mb-2 block">DESCRIPTION</label>
                        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                      </div>
                      <div>
                        <label className="text-minimal text-muted-foreground mb-2 block">AMENITIES (COMMA SEPARATED)</label>
                        <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, Parking, Gym, AC" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">OWNER NAME</label>
                          <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-minimal text-muted-foreground mb-2 block">OWNER PHONE</label>
                          <Input value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value })} />
                        </div>
                      </div>
                      <Button onClick={handleAddProperty} disabled={submitting} className="w-full">
                        {submitting ? "Adding..." : "Add Property"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Inquiries */}
                {tab === "inquiries" && (
                  <div>
                    {inquiries.length === 0 ? (
                      <div className="text-center py-20">
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No inquiries yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left text-minimal text-muted-foreground py-3">NAME</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">EMAIL</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">PHONE</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">MESSAGE</th>
                              <th className="text-left text-minimal text-muted-foreground py-3">DATE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inquiries.map((inq) => (
                              <tr key={inq.id} className="border-b border-border">
                                <td className="py-4 text-foreground">{inq.name}</td>
                                <td className="py-4 text-muted-foreground text-sm">{inq.email}</td>
                                <td className="py-4 text-muted-foreground text-sm">{inq.phone || "-"}</td>
                                <td className="py-4 text-muted-foreground text-sm max-w-xs truncate">{inq.message || "-"}</td>
                                <td className="py-4 text-muted-foreground text-sm">
                                  {new Date(inq.created_at).toLocaleDateString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
