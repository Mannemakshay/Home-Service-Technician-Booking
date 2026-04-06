import { useState, useEffect } from "react";
import { adminLogin, getDashboardAnalytics, getAllUsers, getAllBookingsAdmin, updateUserStatus, getAllReviewsAdmin } from "../api/adminApi";
import { getTechnicians, addTechnician, deleteTechnician } from "../api/technicianApi";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  
  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newTechForm, setNewTechForm] = useState({ name: "", email: "", phone: "", experience: "", skills: "" });

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    if (token && adminData) {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, usersData, bookingsData, techniciansData, reviewsData] = await Promise.all([
        getDashboardAnalytics(),
        getAllUsers(),
        getAllBookingsAdmin(),
        getTechnicians(),
        getAllReviewsAdmin()
      ]);
      
      setAnalytics(analyticsData.stats || {});
      setUsers(usersData.users || []);
      setBookings(bookingsData.bookings || []);
      setTechnicians(techniciansData || []);
      setReviews(reviewsData.reviews || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data");
      
      // Set mock data for testing
      setAnalytics({
        totalUsers: 5,
        totalBookings: 12,
        totalRevenue: 15000,
        totalServices: 8
      });
      setUsers([
        { 
          _id: '1', 
          name: 'John Doe', 
          email: 'john@example.com', 
          role: 'user', 
          isActive: true,
          createdAt: new Date()
        },
        { 
          _id: '2', 
          name: 'Jane Smith', 
          email: 'jane@example.com', 
          role: 'user', 
          isActive: true,
          createdAt: new Date()
        },
        { 
          _id: '3', 
          name: 'Bob Johnson', 
          email: 'bob@example.com', 
          role: 'technician', 
          isActive: true,
          createdAt: new Date()
        },
        { 
          _id: '4', 
          name: 'Alice Brown', 
          email: 'alice@example.com', 
          role: 'user', 
          isActive: false,
          createdAt: new Date()
        }
      ]);
      setBookings([
        { 
          _id: '1', 
          service: 'Plumbing', 
          status: 'completed', 
          user: { name: 'John Doe' }, 
          technician: { name: 'Mike' }, 
          date: new Date(), 
          price: 500 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminLogin(loginForm);
      
      if (!response.token) {
        throw new Error("No token received from server");
      }
      
      localStorage.setItem("adminToken", response.token);
      localStorage.setItem("adminData", JSON.stringify(response.admin));
      setIsLoggedIn(true);
      await fetchDashboardData();
    } catch (err) {
      console.error("Admin login error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      let errorMessage = "Login failed";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setIsLoggedIn(false);
    setAnalytics(null);
    setUsers([]);
    setBookings([]);
    setReviews([]);
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: newStatus } : user
      ));
    } catch {
      setError("Failed to update user status");
    }
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = newTechForm.skills.split(',').map(s => s.trim());
      await addTechnician({ ...newTechForm, experience: Number(newTechForm.experience), skills: skillsArray });
      setNewTechForm({ name: "", email: "", phone: "", experience: "", skills: "" });
      const techniciansData = await getTechnicians();
      setTechnicians(techniciansData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to add technician");
    }
  };

  const handleDeleteTechnician = async (id) => {
    try {
      await deleteTechnician(id);
      setTechnicians(technicians.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete technician");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Admin Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
            <button type="submit" className="btn-glass" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button 
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings ({bookings.length})
        </button>
        <button 
          className={activeTab === "technicians" ? "active" : ""}
          onClick={() => setActiveTab("technicians")}
        >
          Technicians ({technicians.length})
        </button>
        <button 
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        {activeTab === "dashboard" && analytics && (
          <div className="dashboard-stats">
            <h2>Dashboard Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{analytics.totalUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p>{analytics.totalBookings || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹{analytics.totalRevenue || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Services</h3>
                <p>{analytics.totalServices || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-management">
            <h2>User Management</h2>
            
            {users.length === 0 ? (
              <div className="no-data">
                <p>No users found. Users will appear here once they register.</p>
              </div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      return (
                        <tr key={user._id || index}>
                          <td>{user.name || 'N/A'}</td>
                          <td>{user.email || 'N/A'}</td>
                          <td>{user.role || 'User'}</td>
                          <td>
                            <span className={`status ${user.isActive !== false ? 'active' : 'inactive'}`}>
                              {user.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleUserStatusUpdate(user._id, !user.isActive)}
                              className={`status-btn ${user.isActive !== false ? 'deactivate' : 'activate'}`}
                            >
                              {user.isActive !== false ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-management">
            <h2>Booking Management</h2>
            {bookings.length === 0 ? (
              <div className="no-data">
                <p>No bookings found. Bookings will appear here once users make bookings.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <h4>Booking #{booking._id.slice(-6)}</h4>
                      <span className={`status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Service:</strong> {booking.service}</p>
                      <p><strong>Customer:</strong> {booking.user?.name}</p>
                      <p><strong>Technician:</strong> {booking.technician?.name}</p>
                      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Amount:</strong> ₹{booking.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bookings-management">
            <h2>User Reviews & Feedback</h2>
            {reviews.length === 0 ? (
              <div className="no-data">
                <p>No reviews found.</p>
              </div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Service</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review._id}>
                        <td>{review.user?.name || review.user?.email || 'Unknown'}</td>
                        <td>{review.service || 'N/A'}</td>
                        <td>{"⭐".repeat(review.rating || 0)}</td>
                        <td>{review.comment}</td>
                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "technicians" && (
          <div className="users-management">
            <h2>Technician Management</h2>
            <div className="admin-form-card">
              <h3>Add New Technician</h3>
              <form onSubmit={handleAddTechnician}>
                <input type="text" placeholder="Name" required value={newTechForm.name} onChange={e => setNewTechForm({...newTechForm, name: e.target.value})} />
                <input type="email" placeholder="Email" required value={newTechForm.email} onChange={e => setNewTechForm({...newTechForm, email: e.target.value})} />
                <input type="text" placeholder="Phone" required value={newTechForm.phone} onChange={e => setNewTechForm({...newTechForm, phone: e.target.value})} />
                <input type="number" placeholder="Experience (Years)" required value={newTechForm.experience} onChange={e => setNewTechForm({...newTechForm, experience: e.target.value})} />
                <input type="text" placeholder="Skills (comma separated, e.g. Electrician, AC Repair)" required value={newTechForm.skills} onChange={e => setNewTechForm({...newTechForm, skills: e.target.value})} />
                <button type="submit" className="btn-primary">Add Technician</button>
              </form>
            </div>
            
            {technicians.length === 0 ? (
              <div className="no-data">
                <p>No technicians found.</p>
              </div>
            ) : (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Experience</th>
                      <th>Skills</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicians.map((tech) => (
                      <tr key={tech._id}>
                        <td>{tech.name}</td>
                        <td>{tech.email}</td>
                        <td>{tech.experience} yrs</td>
                        <td>{tech.skills?.join(', ')}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteTechnician(tech._id)}
                            className="status-btn deactivate"
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
        )}
      </div>
    </div>
  );
}

export default Admin;
