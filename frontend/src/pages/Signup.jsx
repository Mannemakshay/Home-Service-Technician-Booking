import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/userApi";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) { 
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({ name, email, password });
      
      // Save token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("Registration Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Sign Up</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> 
        <button className="btn-glass" onClick={handleSignup} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;