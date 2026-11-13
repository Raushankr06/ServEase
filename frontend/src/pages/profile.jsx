import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      const updatedUser = {
        ...user,
        ...data.user,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password update failed");
      }

      setMessage(data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <h2>ServEase 🚀</h2>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </nav>

      <main className="dashboard-content">
        <section className="dashboard-hero">
          <h1>My Profile 👤</h1>
          <p>Manage your personal information and account security.</p>
        </section>

        {message && <div className="booking-success">{message}</div>}
        {error && <div className="booking-error">{error}</div>}

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <>
            <section className="profile-card">
              <h2>Personal Information</h2>

              <form onSubmit={handleProfileUpdate}>
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                />

                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />

                <button type="submit" disabled={saving}>
                  {saving ? "Updating..." : "Save Profile"}
                </button>
              </form>
            </section>

            <section className="profile-card">
              <h2>Change Password 🔐</h2>

              <form onSubmit={handlePasswordChange}>
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />

                <label>New Password</label>
                <input
                  type="password"
                  minLength="6"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit">Change Password</button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
