import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const Game = ({ token }) => {
    const canvasRef = useRef(null);
    const wsRef = useRef(null);
    const playersRef = useRef(new Map());
    const playerIdRef = useRef(null);
    const playerPositionRef = useRef(null);
    const isConnectedRef = useRef(false);

    useEffect(() => {
        if (!token) {
            console.error("No token provided");
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        wsRef.current = new WebSocket(`ws://localhost:8080?token=${encodeURIComponent(token)}`);

        wsRef.current.onopen = () => {
            console.log("Connected to the server");
            isConnectedRef.current = true;
        };

        wsRef.current.onmessage = async (event) => {
            try {
                let rawData = event.data instanceof Blob ? await event.data.text() : event.data;
                const data = JSON.parse(rawData);
                console.log("Received message:", data);

                if (data.type === "init") {
                    playerIdRef.current = data.id;
                    playerPositionRef.current = { ...data.position };
                    playersRef.current.set(data.id, {
                        id: data.id,
                        position: { ...data.position }
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
                    console.log("Players updated:", Array.from(playersRef.current.entries()));
                }
            } catch (error) {
                console.error("Failed to parse message:", error);
            }
        };

        wsRef.current.onclose = (event) => {
            console.log("Disconnected from the server:", event.code, event.reason);
            isConnectedRef.current = false;
        };

        wsRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        const handleKeyDown = (event) => {
            if (!playerPositionRef.current || !isConnectedRef.current) return;

            const speed = 5;
            const position = { ...playerPositionRef.current };

            switch (event.key) {
                case "ArrowUp":
                    position.y -= speed;
                    break;
                case "ArrowDown":
                    position.y += speed;
                    break;
                case "ArrowLeft":
                    position.x -= speed;
                    break;
                case "ArrowRight":
                    position.x += speed;
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
                position: playerPositionRef.current
            };
            wsRef.current.send(JSON.stringify(data));
        };

        const drawPlayers = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            playersRef.current.forEach((player, id) => {
                ctx.fillStyle = id === playerIdRef.current ? "blue" : "red";
                ctx.beginPath();
                ctx.fillRect(player.position.x, player.position.y, 20, 20);
                ctx.fillStyle = "black";
                ctx.font = "12px Arial";
                ctx.fillText(id, player.position.x, player.position.y - 5);
            });
        };

        const gameLoop = () => {
            drawPlayers();
            requestAnimationFrame(gameLoop);
        };

        window.addEventListener("keydown", handleKeyDown);
        gameLoop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [token]); // Re-initialize when token changes

    return (
        <div>
            {/* <h1>Multiplayer Game</h1> */}
            <canvas
                ref={canvasRef}
                width={800}
                height={150}
                style={{ border: '1px solid black', margin: '20px' }}
            />
        </div>
    );
};

Game.propTypes = {
    token: PropTypes.string.isRequired,
};