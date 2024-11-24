const WebSocket = require("ws");
const authMiddleware = require("./middleware/auth.js");

const wss = new WebSocket.Server({ port: 8080 });

const players = new Map();
const INITIAL_POSITION = { x: 400, y: 80 };

wss.on("connection", (ws, req) => {
  authMiddleware(ws, req, () => {
    const playerId = ws.username;
    console.log(`Player connected: ${playerId}`);

    players.set(playerId, {
      id: playerId,
      position: { ...INITIAL_POSITION },
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
      console.log(`Player disconnected: ${playerId}`);

      players.delete(playerId);
      broadcastPlayers();
    });

    function broadcastPlayers() {
      const playerData = Array.from(players.entries()).map(([id, player]) => ({
        id: id,
        position: player.position,
      }));

      // console.log("Broadcasting players:", playerData);

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
});

console.log(`websocket server is running on port 8080`);