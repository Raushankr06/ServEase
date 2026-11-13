function Home() {
  const services = [
    ["📱", "Mobile Repair"],
    ["💻", "Laptop Repair"],
    ["📹", "CCTV Installation"],
    ["❄️", "AC Repair"],
    ["⚡", "Electrician"],
    ["🔧", "Plumbing"],
  ];

  return (
    <>
      <section className="hero">
        <p className="tag">YOUR TRUSTED SERVICE PARTNER</p>

        <h1>
          Professional Services.
          <br />
          <span>Right at Your Doorstep.</span>
        </h1>

        <p>
          Book trusted professionals for all your home and technical service
          needs.
        </p>

        <a href="/services" className="hero-btn">
          Explore Services →
        </a>
      </section>

      <section className="services">
        <h2>Our Popular Services</h2>
        <p>Choose the service you need.</p>

        <div className="service-grid">
          {services.map((item, index) => (
            <div className="service-card" key={index}>
              <h1>{item[0]}</h1>
              <h3>{item[1]}</h3>
              <button>Book Now →</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
