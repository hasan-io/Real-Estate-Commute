const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">GET IN TOUCH</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Questions About
                <br />
                TrueNest?
              </h3>

              <div className="space-y-8">
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">EMAIL</h4>
                  <a href="mailto:contact@truenest.in" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                    contact@truenest.in
                  </a>
                </div>

                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">PHONE</h4>
                  <a href="tel:+917123456789" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                    +91 71234 56789
                  </a>
                </div>

                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">OFFICE</h4>
                  <address className="text-xl not-italic">
                    Civil Lines
                    <br />
                    Nagpur, Maharashtra 440001
                  </address>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">CONNECT</h4>
                <div className="space-y-4">
                  <a href="#" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    Instagram
                  </a>
                  <a href="#" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    LinkedIn
                  </a>
                  <a href="#" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    Twitter
                  </a>
                </div>
              </div>

              <div className="pt-12 border-t border-border">
                <p className="text-muted-foreground">
                  TrueNest helps you discover the real cost of living before you move.
                  Whether you are a property seeker, broker, or owner, we bring
                  transparency to every listing in Nagpur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
