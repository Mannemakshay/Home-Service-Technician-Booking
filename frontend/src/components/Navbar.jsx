import { Link } from "react-router-dom";

function Navbar() {
  const isLoggedIn = (() => {
    const token = localStorage.getItem("token");
    return !!token;
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 30px",
      background: "#6c63ff",
      color: "white",
      borderRadius: "8px"
    }}>
      <h2>EasyFix</h2>
      <div style={{display:"flex",gap:"20px", alignItems:"center"}}>
        <Link to="/" style={{ color:"white", textDecoration:"none"}}>Home</Link>
        <Link to="/services" style={{ color:"white", textDecoration:"none"}}>Services</Link>
        <Link to="/admin" style={{ color:"white", textDecoration:"none", background:"rgba(255,215,0,0.3)", padding:"5px 10px", borderRadius:"5px" }}>
          🔐 Admin
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ color:"white", textDecoration:"none"}}>
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid white",
                padding: "5px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{color:"white", textDecoration:"none"}}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;