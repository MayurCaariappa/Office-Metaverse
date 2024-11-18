const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } = require("../config/config.js");

const wss = new WebSocket.Server({ port: 8080 });

const players = new Map();
const INITIAL_POSITION = { x: 400, y: 80 };

wss.on("connection", (ws) => {
  // const playerId = Math.random().toString(36).substring(2, 9);
  const username = jwt.verify({ token, JWT_PASSWORD })
  const playerId = 

  console.log("-------New player connected------");

    players.set(playerId, {
      id: playerId,
      position: { ...INITIAL_POSITION }, //copying
      ws: ws,
    });

  ws.send(
    JSON.stringify({
      type: "init",
      id: playerId,
      position: { ...INITIAL_POSITION },
    })
  );

  broadcastPlayers();

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data);

    // Update player position
    if (players.has(parsedData.id)) {
      const player = players.get(parsedData.id);
      player.position = parsedData.position;
      players.set(parsedData.id, player);
    }

    broadcastPlayers();
  });

  ws.on("close", () => {
    console.log("Player disconnected");

    players.delete(playerId);
    broadcastPlayers();
  });

  function broadcastPlayers() {
    const playerData = Array.from(players.entries()).map(([id, player]) => ({
      id: id,
      position: player.position,
    }));

    const message = JSON.stringify({
      type: "update",
      players: playerData,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
});

console.log(`websocket server is running on port 8080`);