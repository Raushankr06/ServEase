function Services() {
  return (
    <div className="page-container">
      <h1>All Our Services</h1>
      <p>Find the best professionals for your needs.</p>

      <div className="service-grid">
        {[
          "Mobile Repair",
          "Laptop Repair",
          "CCTV Installation",
          "AC Repair",
          "Electrician",
          "Plumbing",
          "Xerox & Printing",
          "Passport Assistance",
          "PAN Card Assistance",
        ].map((service) => (
          <div className="service-card" key={service}>
            <h3>{service}</h3>
            <button>Book Service</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
