import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const Game = ({ token }) => {
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const playersRef = useRef(new Map());
  const playerIdRef = useRef(null);
  const playerPositionRef = useRef(null);
  const isConnectedRef = useRef(false);
  const backgroundImageRef = useRef(null);
  const [playerId, setPlayerId] = useState(null);
  const location = useLocation();
  const mapId = location.state?.mapId;

  useEffect(() => {
    if (!token) {
      console.error("No token provided");
      return;
    }

    console.log("Game.jsx: mapId from location.state:", mapId);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loadBackground = async () => {
      if (!mapId) {
        console.warn("No mapId provided, using white background");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/fetchMap",
          {
            // headers: { Authorization: `Bearer ${token}` }, // Uncomment if backend requires auth
          }
        );
        if (response.status === 200) {
          console.log("Game.jsx: Maps fetched:", response.data.maps);
          const selectedMap = response.data.maps.find(
            (map) => map.mapId === mapId
          );
          if (selectedMap) {
            console.log("Game.jsx: Selected map:", selectedMap);
            const img = new Image();
            img.src = selectedMap.imageUrl;
            img.onload = () => {
              console.log(
                `Game.jsx: Background image loaded: ${selectedMap.imageUrl}`
              );
              backgroundImageRef.current = img;
            };
            img.onerror = () => {
              console.error(
                `Game.jsx: Failed to load background image: ${selectedMap.imageUrl}`
              );
            };
          } else {
            console.warn(`Game.jsx: No map found for mapId: ${mapId}`);
          }
        }
      } catch (error) {
        console.error("Game.jsx: Error fetching map for background:", error);
      }
    };

    loadBackground();

    const connectWebSocket = () => {
      let wsUrl = `ws://localhost:8080?token=${encodeURIComponent(token)}`;
      if (mapId) {
        wsUrl += `&mapId=${encodeURIComponent(mapId)}`;
      }
      console.log("Game.jsx: Connecting WebSocket with URL:", wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("Connected to the server");
        isConnectedRef.current = true;
      };

      wsRef.current.onmessage = async (event) => {
        try {
          let rawData =
            event.data instanceof Blob ? await event.data.text() : event.data;
          const data = JSON.parse(rawData);
          console.log("Received message:", data);

          if (data.type === "init") {
            playerIdRef.current = data.id;
            setPlayerId(data.id);
            playerPositionRef.current = { ...data.position };
            playersRef.current.set(data.id, {
              id: data.id,
              position: { ...data.position },
            });
            console.log("Player initialized:", data.id, data.position);
          } else if (data.type === "update") {
            playersRef.current.clear();
            data.players.forEach((player) => {
              playersRef.current.set(player.id, player);
              if (player.id === playerIdRef.current) {
                playerPositionRef.current = { ...player.position };
              }
            });
            console.log(
              "Players updated:",
              Array.from(playersRef.current.entries())
            );
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("Disconnected from the server:", event.code, event.reason);
        isConnectedRef.current = false;
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    const handleKeyDown = (event) => {
      if (!playerPositionRef.current || !isConnectedRef.current) return;

      const speed = 5;
      const position = { ...playerPositionRef.current };

      switch (event.key) {
        case "ArrowUp":
          position.y = Math.max(0, position.y - speed);
          break;
        case "ArrowDown":
          position.y = Math.min(canvas.height - 20, position.y + speed);
          break;
        case "ArrowLeft":
          position.x = Math.max(0, position.x - speed);
          break;
        case "ArrowRight":
          position.x = Math.min(canvas.width - 20, position.x + speed);
          break;
        default:
          return;
      }

      playerPositionRef.current = position;
      sendMovement();
    };

    const sendMovement = () => {
      if (!playerIdRef.current || !isConnectedRef.current) return;

      const data = {
        id: playerIdRef.current,
        position: playerPositionRef.current,
      };
      wsRef.current.send(JSON.stringify(data));
    };

    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundImageRef.current) {
        ctx.drawImage(
          backgroundImageRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
      } else {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw players
      playersRef.current.forEach((player, id) => {
        ctx.fillStyle = id === playerIdRef.current ? "blue" : "red";
        ctx.fillRect(player.position.x, player.position.y, 20, 20);
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(id, player.position.x, player.position.y - 5);
      });

      requestAnimationFrame(drawGame);
    };

    window.addEventListener("keydown", handleKeyDown);
    drawGame();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token, mapId]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3>Welcome, {playerId || "Player"}!</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

Game.propTypes = {
  token: PropTypes.string.isRequired,
};
