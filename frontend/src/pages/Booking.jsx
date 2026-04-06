import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";
import { getTechnicians } from "../api/technicianApi";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service || "Service";
  
  // Get user from localStorage
  const user = (() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  })();
  
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch technicians from database
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await getTechnicians(service && service !== "Service" ? service : undefined);
        setTechnicians(data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
        setTechnicians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [service]);

  // Filter technicians based on search and inject dynamic prices
  const filteredTechs = technicians.filter((tech) =>
    (tech.name || "").toLowerCase().includes(search.toLowerCase())
  ).map((tech, index) => ({
    ...tech,
    displayPrice: tech.price || (1000 + (index * 850) % 4001)
  }));

  // Convert AM/PM to 24-hour format for backend
  const getFormattedTime = () => {
    return `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
  };

  if (loading) {
    return <div className="loading">Loading technicians...</div>;
  }

  const handleBooking = async () => {
    if (!selectedTech || !selectedDate || !address) {
      alert("Please fill in all fields and select a technician");
      return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token || !user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    
    try {
      // Create booking in backend
      const bookingData = {
        user: user?._id || user?.id,
        service,
        technician: selectedTech._id || selectedTech.id,
        date: selectedDate,
        time: getFormattedTime(),
        address,
        price: selectedTech?.displayPrice || 1000, // Use display price
        status: 'pending'
      };
      
      const response = await createBooking(bookingData);
      
      if (response.error) {
        console.error("Backend error:", response.error);
        alert(`Booking failed: ${response.error}`);
        return;
      }
      
      // Navigate to dashboard with booking confirmation
      navigate("/dashboard", {
        state: {
          name: "User",
          isNew: false,
          service,
          technician: selectedTech._id,
          date: selectedDate,
          time: getFormattedTime(),
          address,
          bookingId: response.booking?._id,
          confirmed: true
        }
      });
    } catch (error) {
      console.error("Frontend error:", error);
      console.error("Error details:", {
        technician: selectedTech,
        technicianId: selectedTech._id
      });
      alert(`Failed to create booking. ${error.message || 'Unknown error'}`);
    }
  };
  return (
    <div className="booking-page">

      {/*  FORM */}
      <div className="booking-form">
        <h2>Book {service}</h2>
        <label>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <label>Select Time</label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "#333",
              color: "white"
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>

          <span style={{ color: "white" }}>:</span>

          <select
            value={selectedMinute}
            onChange={(e) => setSelectedMinute(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "#333",
              color: "white"
            }}
          >
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "#333",
              color: "white"
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <label>Service Address</label>
        <textarea
          placeholder="Enter your full address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      

      {/*  TECHNICIANS */}
      <label>Select Technician</label>

      {/*  Search Input */}
      <input
        type="text"
        placeholder="Search Technician..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        
      />
      </div>

      <div className="tech-grid">
        {filteredTechs.length > 0 ? (
          filteredTechs.map((tech, index) => (
            <div
              key={index}
              className={`tech-card ${selectedTech?._id === tech._id ? "active" : ""}`}
              onClick={() => setSelectedTech(tech)}
            >
              <h4>{tech.name}</h4>
              <p>⭐ {tech.rating}</p>
              <p>{tech.experience} yrs exp</p>
              <p>₹{tech.displayPrice}</p>
            </div>
          ))
        ) : (
          <p>No technicians found</p>
        )}
      </div>

      {selectedTech && (
        <p className="selected-tech">Selected: {selectedTech.name}</p>
      )}

      {/*  BUTTON */}
      <button
        className="btn-glass"
        onClick={handleBooking}
      >
        Confirm Booking
      </button>

    </div>
  );
}
export default Booking;