import { useNavigate } from "react-router-dom";
function ServiceCard({ title, icon, desc, showDesc }) {
  const navigate = useNavigate();
  return (
    <div
      className="card"   
      onClick={() => {
        navigate("/booking", { state: { service: title } });
      }}
    >
      <div style={{ fontSize: "30px", marginBottom: "10px" }}>
        {icon}
      </div>
      <h4>{title}</h4>
      {showDesc && (
        <p style={{ fontSize: "13px", color: "#ccc" }}>
          {desc}
        </p>
      )}
    </div>
  );
}
export default ServiceCard;