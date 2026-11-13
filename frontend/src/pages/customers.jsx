import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/customers?search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customers");
      }

      setCustomers(data.customers || []);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      setMessage("Customer deleted successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage all registered ServEase customers.</p>
        </div>

        <button onClick={() => navigate("/admin")}>Back to Dashboard</button>
      </div>

      <div className="customers-card">
        <div className="customers-toolbar">
          <h2>All Customers ({customers.length})</h2>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLoading(true);
            }}
          />
        </div>

        {message && <p className="customer-message">{message}</p>}

        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>{index + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="customer-delete-btn"
                        onClick={() => deleteCustomer(customer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
