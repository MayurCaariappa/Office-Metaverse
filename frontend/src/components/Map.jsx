import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Map = ({ token }) => {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const fetchMaps = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/fetchMap");
      if (response.status === 200) {
        setMaps(response.data.maps);
      }
    } catch (error) {
      console.error("Error fetching the maps", error);
      alert("Failed to fetch maps.");
    }
  };

  const handleMapSelect = (mapId) => {
    // Navigate to the game with the selected map
    navigate("/game", { state: { mapId, token } });
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <div>
      <h3>Choose your map!</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {maps.length > 0 ? (
          maps.map((map) => (
            <div
              key={map._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                width: "500px",
                height: "200px",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
              onClick={() => handleMapSelect(map.mapId)}
            >
              <h4>{map.mapName}</h4>
              <img
                src={map.imageUrl}
                alt={map.mapName}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          ))
        ) : (
          <p>No maps available</p>
        )}
      </div>
    </div>
  );
};
