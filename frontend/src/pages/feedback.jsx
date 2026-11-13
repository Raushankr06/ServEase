import { useEffect, useState } from "react";
import { createFeedback, getMyFeedback } from "../services/api";

function Feedback() {
  const [formData, setFormData] = useState({
    serviceName: "",
    rating: 5,
    comment: "",
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadFeedback = async () => {
    try {
      const data = await getMyFeedback();
      setFeedbackList(data.feedback || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.serviceName || !formData.comment.trim()) {
      setMessage("Please fill all feedback details.");
      return;
    }

    try {
      setLoading(true);

      const data = await createFeedback({
        ...formData,
        rating: Number(formData.rating),
      });

      setMessage(data.message || "Feedback submitted successfully!");

      setFormData({
        serviceName: "",
        rating: 5,
        comment: "",
      });

      await loadFeedback();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>⭐ Share Your Feedback</h2>
        <p style={styles.subtitle}>Tell us about your ServEase experience.</p>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Service Name</label>
          <input
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            placeholder="e.g. Laptop Repairing"
            required
            style={styles.input}
          />

          <label>Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
            <option value="4">⭐⭐⭐⭐ - Very Good</option>
            <option value="3">⭐⭐⭐ - Good</option>
            <option value="2">⭐⭐ - Average</option>
            <option value="1">⭐ - Poor</option>
          </select>

          <label>Your Comment</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Write your experience..."
            rows="5"
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2>My Feedback</h2>

        {feedbackList.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          feedbackList.map((item) => (
            <div key={item._id} style={styles.feedbackItem}>
              <h3>{item.serviceName}</h3>
              <p>{"⭐".repeat(item.rating)}</p>
              <p>{item.comment}</p>
              <small>{new Date(item.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "850px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
  },
  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "8px 0 18px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
  },
  button: {
    background: "#4338ca",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },
  message: {
    padding: "10px",
    background: "#eef2ff",
    borderRadius: "6px",
  },
  feedbackItem: {
    padding: "15px 0",
    borderBottom: "1px solid #eee",
  },
};

export default Feedback;
