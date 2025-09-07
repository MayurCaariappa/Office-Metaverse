import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Map = ({ token }) => {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const fetchMaps = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/fetchMap",
        {
          // headers: { Authorization: `Bearer ${token}` }, // Uncomment if backend requires auth
        }
      );
      if (response.status === 200) {
        console.log("Fetched maps:", response.data.maps);
        setMaps(response.data.maps);
      }
    } catch (error) {
      console.error("Error fetching the maps:", error);
      alert("Failed to fetch maps.");
    }
  };

  const handleMapSelect = (mapId) => {
    navigate("/game", { state: { mapId } });
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3>Choose your map!</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {maps.length > 0 ? (
          maps.map((map) => (
            <div
              key={map._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                width: "300px",
                cursor: "pointer",
              }}
              onClick={() => handleMapSelect(map.mapId)}
            >
              <h4>{map.mapName}</h4>
              <img
                src={map.imageUrl}
                alt={map.mapName}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={() =>
                  console.error(`Failed to load image: ${map.imageUrl}`)
                }
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
