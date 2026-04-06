import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { getServices } from "../api/serviceApi";
import { FaBolt, FaTools, FaSnowflake, FaBroom, FaPaintRoller, FaHammer } from "react-icons/fa";

// Icon mapping for database services
const getIcon = (serviceName) => {
  const iconMap = {
    "Electrician": <FaBolt />,
    "Plumber": <FaTools />,
    "AC Repair": <FaSnowflake />,
    "Home Cleaning": <FaBroom />,
    "Painting": <FaPaintRoller />,
    "Carpentry": <FaHammer />
  };
  return iconMap[serviceName] || <FaTools />;
};

function Services({ showDesc, showFilter, showSearch }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  //  Filter logic
  const filteredServices = services.filter(service =>
    (selectedCategory === "All" || service.category === selectedCategory) &&
    (service.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="services-page">

      {/* Search */}
      {showSearch && (
        <div className="search-box">
          <input
           type="text"
           placeholder="Search Services..."
           value={search}
           onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
      )}

      {/*  Filters */}
      {showFilter && (
        <div className="filter-box">
          {["All", "Home Repair", "Cleaning", "Appliance"].map((cat) => (
            <button
              key={cat}
              className={`btn-glass filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/*  No results */}
      {filteredServices.length === 0 && (
        <p className="no-results">No services found</p>
      )}

      {/*  Cards */}
      <div className="services">
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.name}
            icon={getIcon(service.name)}
            desc={service.description}
            showDesc={showDesc}
          />
        ))}
      </div>

    </div>
  );
}

export default Services;