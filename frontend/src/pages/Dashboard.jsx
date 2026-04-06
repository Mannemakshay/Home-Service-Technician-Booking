import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { createReview } from "../api/reviewApi";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  })();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const submitFeedback = async () => {
    if (rating === 0 || !feedback.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createReview({
        rating,
        comment: feedback
      });
      alert("Feedback submitted directly to the Admin ✅");
      setRating(0);
      setFeedback("");
    } catch (error) {
      alert("Failed to submit feedback: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const name = user?.name || "User";
  
  // Check for booking confirmation from location state
  const bookingData = location.state;
  const showBookingConfirmation = bookingData?.confirmed;

  return (
    <div className="dashboard">
      <div className="dashboard-container">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Welcome back, {name}! 👋</h2>
          <button 
            onClick={handleLogout}
            style={{
              background: "#ff4757",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {showBookingConfirmation && (
          <div style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            color: "#155724"
          }}>
            <h3>🎉 Booking Confirmed!</h3>
            <div style={{ marginBottom: "15px" }}>
              <p><strong>Service:</strong> {bookingData.service}</p>
              <p><strong>Technician:</strong> {bookingData.technician}</p>
              <p><strong>Date:</strong> {bookingData.date}</p>
              <p><strong>Time:</strong> {bookingData.time}</p>
              <p><strong>Address:</strong> {bookingData.address}</p>
              {bookingData.bookingId && (
                <p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
              )}
            </div>
            <button 
              className="btn-glass"
              onClick={() => window.location.reload()}
              style={{ background: "#155724" }}
            >
              Got it!
            </button>
          </div>
        )}

        {user && (
          <div style={{ 
            background: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            color: "#333"
          }}>
            <h4 style={{ color: "#333", marginBottom: "10px" }}>Your Profile</h4>
            <p style={{ color: "#666", margin: "5px 0" }}><strong>Email:</strong> {user.email}</p>
            <p style={{ color: "#666", margin: "5px 0" }}><strong>User ID:</strong> {user.id}</p>
          </div>
        )}

        <div className="center-box">
          <p>No bookings yet. Start by booking a service 🚀</p>
          <button
            className="btn-glass"
            onClick={() => navigate("/services")}
          >
            Book Service
          </button>
        </div>

        <div className="feedback-section">
          <h4>Rate Service</h4>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  color: star <= rating ? "#ffc107" : "#ccc"
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            className="btn-glass"
            onClick={submitFeedback}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;