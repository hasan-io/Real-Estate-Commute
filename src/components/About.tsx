const About = () => {
  return (
    <section id="about" className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">ABOUT TRUENEST</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Beyond Rent. The Real Cost of Living.
              </h3>

              <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  TrueNest is Nagpur's first real estate platform that reveals the
                  true monthly cost of living. We combine rent, commute expenses,
                  and local living costs to give you a transparent picture before
                  you sign a lease.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is simple: help you find a home that fits your budget,
                  lifestyle, and daily commute. No hidden costs. No surprises.
                  Just honest numbers.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">HOW IT WORKS</h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-foreground pl-6">
                    <h5 className="text-lg font-medium mb-2">True Cost Calculation</h5>
                    <p className="text-muted-foreground">
                      Rent + commute cost + local expenses = your real monthly spend
                    </p>
                  </div>
                  <div className="border-l-2 border-foreground pl-6">
                    <h5 className="text-lg font-medium mb-2">Lifestyle Matching</h5>
                    <p className="text-muted-foreground">
                      Properties scored against your lifestyle preferences
                    </p>
                  </div>
                  <div className="border-l-2 border-foreground pl-6">
                    <h5 className="text-lg font-medium mb-2">Time Impact Analysis</h5>
                    <p className="text-muted-foreground">
                      See how much time you lose to commuting every month and year
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-minimal text-muted-foreground mb-2">PROPERTIES</h4>
                    <p className="text-xl">500+</p>
                  </div>
                  <div>
                    <h4 className="text-minimal text-muted-foreground mb-2">CITY</h4>
                    <p className="text-xl">Nagpur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
