import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const services = [
  {
    name: "Mobile Repairing",
    category: "Repair",
    icon: "📱",
    description: "Mobile screen, battery and software repair.",
  },
  {
    name: "Laptop Repairing",
    category: "Repair",
    icon: "💻",
    description: "Laptop hardware and software solutions.",
  },
  {
    name: "CCTV Installation",
    category: "Security",
    icon: "📹",
    description: "CCTV camera installation and maintenance.",
  },
  {
    name: "Xerox & Printing",
    category: "Documents",
    icon: "📄",
    description: "Photocopy, printing and document services.",
  },
  {
    name: "PAN Card Apply",
    category: "Documents",
    icon: "🪪",
    description: "Assistance with PAN card applications.",
  },
  {
    name: "Passport Apply",
    category: "Documents",
    icon: "🛂",
    description: "Assistance with passport applications.",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [bookings, setBookings] = useState([]);

  const [booking, setBooking] = useState({
    date: "",
    time: "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Unable to load booking updates:", err);
      }
    };

    if (token) fetchUpdates();
  }, [token]);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!/^[0-9]{10}$/.test(booking.phone)) {
      setError("Please enter a valid 10 digit phone number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceName: selectedService.name,
          appointmentDate: booking.date,
          appointmentTime: booking.time,
          phone: booking.phone,
          address: booking.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setMessage(
        `${selectedService.name} booked successfully! Booking ID: ${data.booking._id}`,
      );

      setSelectedService(null);

      setBooking({
        date: "",
        time: "",
        phone: user.phone || "",
        address: user.address || "",
      });

      setBookings((previous) => [data.booking, ...previous]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const statusCounts = {
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  const recentBookings = [...bookings].slice(0, 4);

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <h2>ServEase 🚀</h2>

        <div className="customer-nav-actions">
          <span>Welcome, {user.name}</span>

          <button onClick={() => navigate("/profile")}>👤 Profile</button>

          <button onClick={() => navigate("/my-bookings")}>
            📋 My Bookings
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="dashboard-hero">
          <h1>Hello, {user.name}! 👋</h1>
          <p>Find the right service. Book it easily. Get it done!</p>
          <button
            className="hero-action"
            onClick={() =>
              document.getElementById("services")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Explore Services →
          </button>
        </section>

        {message && (
          <div className="booking-success">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {error && (
          <div className="booking-error">
            <span>{error}</span>
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <section className="customer-stats">
          <div>
            <span>📋</span>
            <p>Total Bookings</p>
            <h2>{bookings.length}</h2>
          </div>
          <div>
            <span>⏳</span>
            <p>Pending</p>
            <h2>{statusCounts.Pending}</h2>
          </div>
          <div>
            <span>✅</span>
            <p>Confirmed</p>
            <h2>{statusCounts.Confirmed}</h2>
          </div>
          <div>
            <span>🎉</span>
            <p>Completed</p>
            <h2>{statusCounts.Completed}</h2>
          </div>
        </section>

        <section className="dashboard-card customer-profile-summary">
          <div>
            <h2>My Profile</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "Not added"}
            </p>
          </div>

          <button onClick={() => navigate("/profile")}>Edit Profile →</button>
        </section>

        <section className="services-section" id="services">
          <h2>Explore Our Services</h2>
          <p>Select a service and book your appointment.</p>

          <div className="service-toolbar">
            <input
              type="search"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Repair">Repair Services</option>
              <option value="Security">Security Services</option>
              <option value="Documents">Document Services</option>
            </select>
          </div>

          <div className="service-grid">
            {filteredServices.map((service) => (
              <div className="service-card" key={service.name}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>

                <button
                  onClick={() => {
                    setMessage("");
                    setError("");
                    setSelectedService(service);
                  }}
                >
                  Book Now →
                </button>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="dashboard-card">
              No services found. Try another search.
            </div>
          )}
        </section>

        <section className="dashboard-card recent-updates">
          <div className="recent-heading">
            <div>
              <h2>Booking Updates 🔔</h2>
              <p>Latest updates about your service requests.</p>
            </div>

            <button onClick={() => navigate("/my-bookings")}>View All</button>
          </div>

          {recentBookings.length === 0 ? (
            <p>No booking updates yet.</p>
          ) : (
            recentBookings.map((item) => (
              <div className="update-row" key={item._id}>
                <div>
                  <strong>{item.serviceName}</strong>
                  <small>
                    {item.appointmentDate} · {item.appointmentTime}
                  </small>
                </div>

                <span className={`admin-status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>
            ))
          )}
        </section>
      </main>

      {selectedService && (
        <div className="booking-overlay">
          <div className="booking-modal">
            <button
              className="close-booking"
              onClick={() => setSelectedService(null)}
              disabled={submitting}
            >
              ×
            </button>

            <h2>{selectedService.icon} Book Service</h2>
            <h3>{selectedService.name}</h3>
            <p>Enter your details to request a booking.</p>

            <form onSubmit={handleBooking}>
              <label>Appointment Date</label>
              <input
                type="date"
                min={minDate}
                required
                value={booking.date}
                onChange={(e) =>
                  setBooking({ ...booking, date: e.target.value })
                }
              />

              <label>Appointment Time</label>
              <input
                type="time"
                required
                value={booking.time}
                onChange={(e) =>
                  setBooking({ ...booking, time: e.target.value })
                }
              />

              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
                value={booking.phone}
                onChange={(e) =>
                  setBooking({ ...booking, phone: e.target.value })
                }
              />

              <label>Full Address</label>
              <textarea
                placeholder="Enter your complete address"
                required
                value={booking.address}
                onChange={(e) =>
                  setBooking({ ...booking, address: e.target.value })
                }
              />

              <button
                type="submit"
                className="confirm-booking"
                disabled={submitting}
              >
                {submitting ? "Saving Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
