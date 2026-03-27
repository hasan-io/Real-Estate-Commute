import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useUser, UserRole, LifestylePreference } from "@/contexts/UserContext";
import { Building2, Users, UserCheck, Volume2, Home, Coffee, Dumbbell, PartyPopper, MapPin } from "lucide-react";

const RoleSelectionModal = () => {
  const { preferences, setPreferences, hasCompletedOnboarding } = useUser();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(null);
  const [lifestyle, setLifestyle] = useState<LifestylePreference>(null);
  const [budget, setBudget] = useState(20000);
  const [officeLocation, setOfficeLocation] = useState("");

  useEffect(() => {
    if (hasCompletedOnboarding) return;
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "user") {
      setStep(2);
    } else {
      setPreferences({
        role: selectedRole,
        lifestylePreference: null,
        monthlyBudget: 0,
        officeLocation: "",
      });
      setOpen(false);
    }
  };

  const handleLifestyleSelect = (pref: LifestylePreference) => {
    setLifestyle(pref);
    setStep(3);
  };

  const handleComplete = () => {
    setPreferences({
      role,
      lifestylePreference: lifestyle,
      monthlyBudget: budget,
      officeLocation,
    });
    setOpen(false);
  };

  const roles = [
    { value: "user" as UserRole, label: "Property Seeker", icon: Users, desc: "Looking for a place to live" },
    { value: "broker" as UserRole, label: "Broker", icon: UserCheck, desc: "Real estate professional" },
    { value: "owner" as UserRole, label: "Owner / Developer", icon: Building2, desc: "Property owner or builder" },
  ];

  const lifestyles = [
    { value: "quiet" as LifestylePreference, label: "Quiet & Peaceful", icon: Volume2 },
    { value: "family" as LifestylePreference, label: "Family Oriented", icon: Home },
    { value: "cafe" as LifestylePreference, label: "Cafe & Work Culture", icon: Coffee },
    { value: "fitness" as LifestylePreference, label: "Fitness & Active", icon: Dumbbell },
    { value: "nightlife" as LifestylePreference, label: "Nightlife & Social", icon: PartyPopper },
  ];

  const formatBudget = (val: number) => {
    if (val >= 100000) return `Rs.${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `Rs.${(val / 1000).toFixed(0)}K`;
    return `Rs.${val}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg bg-background border-border">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-architectural text-center">
                Welcome to TrueNest
              </DialogTitle>
              <p className="text-center text-muted-foreground text-sm mt-2">
                How would you like to use TrueNest?
              </p>
            </DialogHeader>
            <div className="space-y-3 mt-6">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  className="w-full flex items-center gap-4 p-4 border border-border hover:border-foreground transition-colors duration-300 text-left"
                >
                  <r.icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{r.label}</p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-architectural text-center">
                Your Lifestyle Preference
              </DialogTitle>
              <p className="text-center text-muted-foreground text-sm mt-2">
                What matters most to you in a neighborhood?
              </p>
            </DialogHeader>
            <div className="space-y-3 mt-6">
              {lifestyles.map((l) => (
                <button
                  key={l.value}
                  onClick={() => handleLifestyleSelect(l.value)}
                  className="w-full flex items-center gap-4 p-4 border border-border hover:border-foreground transition-colors duration-300 text-left"
                >
                  <l.icon className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium text-foreground">{l.label}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-architectural text-center">
                Budget & Location
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 mt-6">
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-minimal text-muted-foreground">MONTHLY BUDGET</span>
                  <span className="text-foreground font-medium">{formatBudget(budget)}</span>
                </div>
                <Slider
                  value={[budget]}
                  onValueChange={(v) => setBudget(v[0])}
                  min={10000}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Rs.10,000</span>
                  <span className="text-xs text-muted-foreground">Rs.1,00,000</span>
                </div>
              </div>

              <div>
                <label className="text-minimal text-muted-foreground mb-3 block">
                  OFFICE LOCATION (OPTIONAL)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    placeholder="e.g., Sitabuldi, Nagpur"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;
