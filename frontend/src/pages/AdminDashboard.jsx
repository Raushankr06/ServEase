import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAdminData = async () => {
    try {
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResponse, bookingsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats", { headers }),
        fetch("http://localhost:5000/api/admin/bookings", { headers }),
      ]);

      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();

      if (!statsResponse.ok) {
        throw new Error(statsData.message || "Unable to load statistics");
      }

      if (!bookingsResponse.ok) {
        throw new Error(bookingsData.message || "Unable to load bookings");
      }

      setStats(statsData.stats);
      setBookings(bookingsData.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      fetchAdminData();
    }
  }, []);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(search) ||
      booking.user?.email?.toLowerCase().includes(search) ||
      booking.serviceName?.toLowerCase().includes(search) ||
      booking.phone?.includes(search);

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed");
      }

      await fetchAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>
          ServEase<span>.</span>
        </h2>

        <p className="admin-label">ADMIN PANEL</p>

        <button className="active" onClick={() => window.scrollTo(0, 0)}>
          📊 Dashboard
        </button>

        <button
          onClick={() =>
            document
              .getElementById("all-bookings")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          📋 All Bookings
        </button>

        <button onClick={() => navigate("/admin/customers")}>
          👥 Manage Customers
        </button>

        <button onClick={() => navigate("/dashboard")}>🏠 Customer View</button>

        <button onClick={handleLogout} className="admin-logout">
          🚪 Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your ServEase platform</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>{user.name}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Here is what's happening with your business today.</p>
          </div>
          <span>⚡ ServEase Management</span>
        </section>

        {error && (
          <div className="admin-error">
            {error}
            <button onClick={fetchAdminData}>Retry</button>
          </div>
        )}

        <section className="admin-stats">
          <div className="admin-stat-card purple">
            <span>👥</span>
            <p>Total Customers</p>
            <h2>{stats.totalUsers}</h2>
          </div>

          <div className="admin-stat-card blue">
            <span>📋</span>
            <p>Total Bookings</p>
            <h2>{stats.totalBookings}</h2>
          </div>

          <div className="admin-stat-card orange">
            <span>⏳</span>
            <p>Pending Bookings</p>
            <h2>{stats.pendingBookings}</h2>
          </div>

          <div className="admin-stat-card green">
            <span>✅</span>
            <p>Confirmed Bookings</p>
            <h2>{stats.confirmedBookings}</h2>
          </div>

          <div className="admin-stat-card teal">
            <span>🎉</span>
            <p>Completed Bookings</p>
            <h2>{stats.completedBookings}</h2>
          </div>

          <div className="admin-stat-card red">
            <span>❌</span>
            <p>Cancelled Bookings</p>
            <h2>{stats.cancelledBookings}</h2>
          </div>
        </section>

        <section className="admin-bookings" id="all-bookings">
          <div className="admin-section-heading">
            <div>
              <h2>All Customer Bookings</h2>
              <p>Search and manage customer service requests.</p>
            </div>

            <button onClick={fetchAdminData}>🔄 Refresh</button>
          </div>

          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search customer, email, service or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {loading ? (
            <div className="admin-empty">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="admin-empty">
              <span>📭</span>
              <h3>No Bookings Found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <strong>{booking.user?.name || "Unknown"}</strong>
                        <small>{booking.user?.email || "No email"}</small>
                      </td>

                      <td>{booking.serviceName}</td>
                      <td>{booking.appointmentDate}</td>
                      <td>{booking.appointmentTime}</td>
                      <td>{booking.phone}</td>
                      <td>{booking.address}</td>

                      <td>
                        <span
                          className={`admin-status ${booking.status?.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td>
                        <select
                          value={booking.status}
                          disabled={updatingId === booking._id}
                          onChange={(e) =>
                            handleStatusChange(booking._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {updatingId === booking._id && (
                          <small>Updating...</small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="admin-footer">
          © 2026 ServEase. Admin Management Panel.
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
