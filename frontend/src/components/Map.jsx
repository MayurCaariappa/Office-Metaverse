import React, { useState, useEffect } from "react";
import axios from "axios";

export const Map = ({ token }) => {
    const [maps, setMaps] = useState([]);

    const fetchMaps = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/fetchMap");

            if (response.status === 200) {
                setMaps(response.data.maps);
                // alert("Maps fetched successfully");
            }
        } catch (error) {
            console.error("Error fetching the maps", error);
            alert("Failed to fetch maps."); 
        }
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
                            }}
                        >
                            <h4>{map.mapName}</h4>
                            <img
                                src={map.imageUrl} // Use the image URL from the API
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