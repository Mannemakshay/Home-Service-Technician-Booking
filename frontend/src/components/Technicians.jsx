import { useState, useEffect } from "react";
import { getTechnicians } from "../api/technicianApi";
import ServiceCard from "./ServiceCard";

function Technicians({ showDesc = true, showFilter = true, showSearch = true }) {
  const [technicians, setTechnicians] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const data = await getTechnicians();
      setTechnicians(data);
    } catch (error) {
      console.error("Failed to fetch technicians:", error);
      alert("Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  // Normalize skills for the filter buttons
  const normalizedSkillsArray = technicians.flatMap(tech => tech.skills || []).map(skill => skill.trim());
  
  // Create a unique array of title-cased skills
  const allSkills = [...new Set(normalizedSkillsArray.map(skill => 
    skill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  ))];

  // Filter logic
  const filteredTechnicians = technicians.filter(technician => {
    const matchesCategory = selectedCategory === "All" || technician.skills?.some(
      skill => skill.trim().toLowerCase() === selectedCategory.toLowerCase()
    );
    const matchesSearch = (technician.name?.toLowerCase().includes(search.toLowerCase()) ||
                           technician.email?.toLowerCase().includes(search.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading technicians...</div>;
  }

  return (
    <div className="services-page">
      {/* Search */}
      {showSearch && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Technicians..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Filters */}
      {showFilter && (
        <div className="filter-box">
          <button
            className={`btn-glass filter-btn ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              className={`btn-glass filter-btn ${selectedCategory === skill ? "active" : ""}`}
              onClick={() => setSelectedCategory(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {filteredTechnicians.length === 0 && (
        <p className="no-results">No technicians found</p>
      )}

      {/* Cards */}
      <div className="services">
        {filteredTechnicians.map((technician) => (
          <ServiceCard
            key={technician._id}
            title={technician.name}
            desc={`${technician.skills?.join(", ") || "No skills listed"} - ${technician.email}`}
            showDesc={showDesc}
            technician={technician}
          />
        ))}
      </div>
    </div>
  );
}

export default Technicians;
