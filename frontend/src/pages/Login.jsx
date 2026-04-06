import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/userApi";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      
      // Save token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Login</h2>

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

        <button className="btn-glass" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New user?{" "}
          <span onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;