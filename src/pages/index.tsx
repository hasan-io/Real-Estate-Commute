import React from "react";

const properties = [
  {
    id: 1,
    title: "Modern 2BHK Apartment",
    location: "Mumbai",
    price: "₹75,00,000",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Luxury Villa",
    location: "Goa",
    price: "₹2,50,00,000",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "Affordable Studio",
    location: "Pune",
    price: "₹35,00,000",
    image: "https://via.placeholder.com/300",
  },
];

const Home: React.FC = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          backgroundColor: "#1e293b",
          color: "#fff",
        }}
      >
        <h2>RealEstateX</h2>
        <div>
          <button style={{ marginRight: "10px" }}>Buy</button>
          <button style={{ marginRight: "10px" }}>Rent</button>
          <button>Contact</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        style={{
          padding: "3rem",
          textAlign: "center",
          backgroundColor: "#f1f5f9",
        }}
      >
        <h1>Find Your Dream Property</h1>
        <p>Explore the best properties across India</p>
        <input
          type="text"
          placeholder="Search by city..."
          style={{
            padding: "10px",
            width: "300px",
            marginTop: "1rem",
          }}
        />
      </header>

      {/* Property Listings */}
      <section style={{ padding: "2rem" }}>
        <h2>Featured Properties</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "1rem",
          }}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
              }}
            >
              <img
                src={property.image}
                alt={property.title}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <p style={{ fontWeight: "bold" }}>{property.price}</p>
              <button style={{ marginTop: "10px" }}>View Details</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#1e293b",
          color: "#fff",
          marginTop: "2rem",
        }}
      >
        <p>© 2026 RealEstateX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;