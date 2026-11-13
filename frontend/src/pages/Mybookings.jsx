import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function MyBookings() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchBookings = async () => {
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

        if (!response.ok) {
          throw new Error(data.message || "Unable to load bookings");
        }

        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBookings();
    else setLoading(false);
  }, [token]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel booking");
      }

      setBookings((previous) =>
        previous.map((item) =>
          item._id === bookingId ? { ...item, status: "Cancelled" } : item,
        ),
      );

      setMessage("Booking cancelled successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId("");
    }
  };

  // Escape values before inserting them into the printable receipt.
  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );

  const printReceipt = (item) => {
    const receiptWindow = window.open("", "_blank", "width=800,height=700");

    if (!receiptWindow) {
      setError("Please allow pop-ups to print your receipt.");
      return;
    }

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ServEase Booking Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 35px;
              color: #222;
            }
            .receipt {
              max-width: 650px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 30px;
              border-radius: 12px;
            }
            h1 { color: #4f46e5; }
            .line {
              border-bottom: 1px solid #ddd;
              padding: 13px 0;
            }
            strong { display: inline-block; width: 150px; }
            .footer {
              margin-top: 35px;
              color: #777;
              text-align: center;
            }
            button {
              margin-top: 25px;
              padding: 12px 20px;
              background: #4f46e5;
              color: white;
              border: 0;
              border-radius: 6px;
            }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h1>ServEase 🚀</h1>
            <h2>Booking Receipt</h2>
            <div class="line"><strong>Booking ID:</strong> ${escapeHTML(item._id)}</div>
            <div class="line"><strong>Customer:</strong> ${escapeHTML(user?.name)}</div>
            <div class="line"><strong>Service:</strong> ${escapeHTML(item.serviceName)}</div>
            <div class="line"><strong>Date:</strong> ${escapeHTML(item.appointmentDate)}</div>
            <div class="line"><strong>Time:</strong> ${escapeHTML(item.appointmentTime)}</div>
            <div class="line"><strong>Phone:</strong> ${escapeHTML(item.phone)}</div>
            <div class="line"><strong>Address:</strong> ${escapeHTML(item.address)}</div>
            <div class="line"><strong>Status:</strong> ${escapeHTML(item.status)}</div>
            <div class="footer">Thank you for choosing ServEase!</div>
            <button onclick="window.print()">Print / Save as PDF</button>
          </div>
        </body>
      </html>
    `);

    receiptWindow.document.close();
    receiptWindow.focus();
  };

  const filteredBookings = bookings.filter((item) => {
    const matchesSearch =
      item.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      item._id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <h2>ServEase 🚀</h2>
        <div className="customer-nav-actions">
          <button onClick={() => navigate("/profile")}>👤 Profile</button>
          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="dashboard-hero">
          <h1>My Bookings 📋</h1>
          <p>Track and manage all your service booking requests.</p>
        </section>

        {message && <div className="booking-success">{message}</div>}
        {error && <div className="booking-error">{error}</div>}

        <section className="booking-summary">
          <div>
            <strong>{bookings.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>
              {bookings.filter((b) => b.status === "Pending").length}
            </strong>
            <span>Pending</span>
          </div>
          <div>
            <strong>
              {bookings.filter((b) => b.status === "Confirmed").length}
            </strong>
            <span>Confirmed</span>
          </div>
          <div>
            <strong>
              {bookings.filter((b) => b.status === "Completed").length}
            </strong>
            <span>Completed</span>
          </div>
          <div>
            <strong>
              {bookings.filter((b) => b.status === "Cancelled").length}
            </strong>
            <span>Cancelled</span>
          </div>
        </section>

        <div className="booking-filters">
          <input
            type="search"
            placeholder="Search by service or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading && <p>Loading your bookings...</p>}

        {!loading && bookings.length === 0 && (
          <section className="dashboard-card">
            <h2>No Bookings Found</h2>
            <p>You have not booked any service yet.</p>
            <button onClick={() => navigate("/dashboard")}>
              Explore Services
            </button>
          </section>
        )}

        {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
          <section className="dashboard-card">
            No bookings match your search or filter.
          </section>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="service-grid">
            {filteredBookings.map((item) => (
              <div className="service-card booking-history-card" key={item._id}>
                <h3>🔧 {item.serviceName}</h3>

                <p>
                  <strong>Booking ID:</strong>
                </p>
                <p className="booking-id">{item._id}</p>

                <p>
                  <strong>Date:</strong> {item.appointmentDate}
                </p>
                <p>
                  <strong>Time:</strong> {item.appointmentTime}
                </p>
                <p>
                  <strong>Phone:</strong> {item.phone}
                </p>
                <p>
                  <strong>Address:</strong> {item.address}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`admin-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </p>

                <div className="booking-card-actions">
                  <button
                    className="receipt-button"
                    onClick={() => printReceipt(item)}
                  >
                    🧾 Print Receipt
                  </button>

                  {item.status === "Pending" && (
                    <button
                      className="customer-delete-btn"
                      onClick={() => handleCancelBooking(item._id)}
                      disabled={cancellingId === item._id}
                    >
                      {cancellingId === item._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyBookings;
