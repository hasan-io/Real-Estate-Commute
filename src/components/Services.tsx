import { Wrench, UtensilsCrossed, Zap, Droplets } from "lucide-react";

const Services = () => {
  const services = [
    {
      number: "01",
      title: "MAID SERVICES",
      description: "Reliable domestic help available across all listed localities. Average cost Rs.3,000 - Rs.6,000/month depending on area.",
      icon: Wrench,
      availability: "Available in most areas",
      cost: "Rs.3,000 - Rs.6,000/mo",
    },
    {
      number: "02",
      title: "COOK",
      description: "Professional cooks for daily meals. Tiffin and full-time options available across Nagpur neighborhoods.",
      icon: UtensilsCrossed,
      availability: "High availability",
      cost: "Rs.4,000 - Rs.8,000/mo",
    },
    {
      number: "03",
      title: "ELECTRICIAN",
      description: "On-call electrical repair and maintenance services. Emergency support available in most localities.",
      icon: Zap,
      availability: "On-call basis",
      cost: "Rs.200 - Rs.500/visit",
    },
    {
      number: "04",
      title: "PLUMBER",
      description: "Plumbing repair, installation, and emergency services. Trusted professionals verified by TrueNest.",
      icon: Droplets,
      availability: "On-call basis",
      cost: "Rs.250 - Rs.600/visit",
    },
  ];

  return (
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">LOCAL SERVICES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Essential Services Near You
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-6">
                  <span className="text-minimal text-muted-foreground font-medium">
                    {service.number}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <service.icon className="w-5 h-5 text-muted-foreground" />
                      <h4 className="text-2xl font-light text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                        {service.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-minimal text-muted-foreground mb-1">AVAILABILITY</p>
                        <p className="text-sm text-foreground">{service.availability}</p>
                      </div>
                      <div>
                        <p className="text-minimal text-muted-foreground mb-1">COST</p>
                        <p className="text-sm text-foreground">{service.cost}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
