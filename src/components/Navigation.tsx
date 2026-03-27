import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser, UserRole } from "@/contexts/UserContext";
import { User, Briefcase, Building2, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { preferences, setPreferences } = useUser();

  const showDashboard = preferences.role === "broker" || preferences.role === "owner";
  const showListProperty = preferences.role === "user";

  const roleOptions: { value: UserRole; label: string; icon: typeof User }[] = [
    { value: "user", label: "User", icon: User },
    { value: "broker", label: "Broker", icon: Briefcase },
    { value: "owner", label: "Owner", icon: Building2 },
  ];

  const currentRole = roleOptions.find((r) => r.value === preferences.role) || roleOptions[0];
  const RoleIcon = currentRole.icon;

  const handleRoleSwitch = (role: UserRole) => {
    setPreferences({ ...preferences, role });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-minimal text-foreground">
          TRUENEST
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/properties?listing=Sale" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            BUY
          </Link>
          <Link to="/properties?listing=Rent" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            RENT
          </Link>
          <Link to="/properties?listing=Sale&type=Villa" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            NEW PROJECTS
          </Link>
          <Link to="/properties?type=Independent+House" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            COMMERCIAL
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-minimal text-muted-foreground border border-border px-3 py-1.5 hover:text-foreground hover:border-foreground transition-colors duration-300 cursor-pointer">
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{currentRole.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = preferences.role === option.value;
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleRoleSwitch(option.value)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          {showListProperty && (
            <Link to="/properties" className="text-minimal text-foreground border border-foreground px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors duration-300">
              LIST PROPERTY
            </Link>
          )}
          {showDashboard && (
            <Link to="/dashboard" className="text-minimal text-foreground border border-foreground px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors duration-300">
              DASHBOARD
            </Link>
          )}
          <ThemeToggle />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "\u2715" : "\u2630"}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-6 space-y-4">
            {preferences.role && (
              <div className="flex items-center gap-2 text-minimal text-muted-foreground pb-4 border-b border-border">
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{currentRole.label}</span>
              </div>
            )}
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.role === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => { handleRoleSwitch(option.value); setIsMenuOpen(false); }}
                  className="flex items-center justify-between w-full text-left text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    {option.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              );
            })}
            <Link to="/properties?listing=Sale" className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              BUY
            </Link>
            <Link to="/properties?listing=Rent" className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              RENT
            </Link>
            <Link to="/properties?listing=Sale&type=Villa" className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              NEW PROJECTS
            </Link>
            <Link to="/properties?type=Independent+House" className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              COMMERCIAL
            </Link>
            {showListProperty && (
              <Link to="/properties" className="block text-minimal text-foreground" onClick={() => setIsMenuOpen(false)}>
                LIST PROPERTY
              </Link>
            )}
            {showDashboard && (
              <Link to="/dashboard" className="block text-minimal text-foreground" onClick={() => setIsMenuOpen(false)}>
                DASHBOARD
              </Link>
            )}
            <div className="pt-4 border-t border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
