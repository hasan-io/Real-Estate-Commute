import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-architecture.jpg";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType) params.set("type", propertyType);
    if (listingType) params.set("listing", listingType);
    if (budget) params.set("budget", budget);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white text-architectural mb-4 reveal">
          Find Your Perfect Home in Nagpur
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide max-w-2xl mx-auto reveal-delayed mb-12">
          Because the real cost matters. Discover true monthly costs before you move.
        </p>

        {/* Search Bar */}
        <div className="bg-background/95 backdrop-blur-md p-4 md:p-6 reveal-delayed">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-1">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-12 border-border"
              />
            </div>
            <div className="md:col-span-1">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Independent House">Independent House</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Rent / Buy / PG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Sale">Buy</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">Up to Rs.10,000</SelectItem>
                  <SelectItem value="20000">Up to Rs.20,000</SelectItem>
                  <SelectItem value="30000">Up to Rs.30,000</SelectItem>
                  <SelectItem value="50000">Up to Rs.50,000</SelectItem>
                  <SelectItem value="100000">Up to Rs.1,00,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Button onClick={handleSearch} className="w-full h-12">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 reveal-delayed">
        <div className="w-px h-16 bg-white/40" />
        <div className="text-minimal text-white/60 mt-4 rotate-90 origin-center">
          SCROLL
        </div>
      </div>
    </section>
  );
};

export default Hero;
