const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const players = new Map();

wss.on("connection", (ws) => {
  console.log("-------New player connected------");

  // Assign a unique ID to the connection
  const playerId = Math.random().toString(36).substring(2, 9);

  // Store the player with their websocket connection
  players.set(playerId, {
    id: playerId,
    position: { x: 400, y: 80 },
    ws: ws,
  });

  // Send the new player their ID
  ws.send(
    JSON.stringify({
      type: "init",
      id: playerId,
    })
  );

  // Broadcast updated players list to all clients
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

    // Remove disconnected player
    players.delete(playerId);
    broadcastPlayers();
  });

  // Function to broadcast players to all clients
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