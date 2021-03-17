const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { initGame, gameLoop, getUpdatedVelocity } = require("./game");
const { makeid, FRAME_RATE } = require("./utils");
require("dotenv").config({
  path: path.join(process.cwd(), "/config/.env"),
});

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
const state = {};
const clientRooms = {};

//on clicking on any key
const handleKeydown = (client,keyCode) => {
  const roomName = clientRooms[client.id];
  if (!roomName) return;
  try {
    keyCode = parseInt(keyCode);
  } catch (e) {
    console.error(e);
    return;
  }

  const vel = getUpdatedVelocity(keyCode);

  if (vel) 
    state[roomName].players[client.number - 1].vel = vel;
  
}

const handleJoinGame = (client,roomName) => {
  const room = io.sockets.adapter.rooms[roomName];

  let allUsers;
  if (room) allUsers = room.sockets;

  let numClients = 0;
  if (allUsers) numClients = Object.keys(allUsers).length;

  if (numClients === 0) {
    client.emit("unknownCode");
    return;
  } else if (numClients > 1) {
    client.emit("tooManyPlayers");
    return;
  }

  clientRooms[client.id] = roomName;

  client.join(roomName);
  client.number = 2;
  client.emit("init", 2);

  startGameInterval(roomName);
};
//starting a new game
const handleNewGame = (client) => {
  let roomName = makeid(5);
  clientRooms[client.id] = roomName;
  client.emit("gameCode", roomName);

  state[roomName] = initGame();

  client.join(roomName);
  client.number = 1;
  client.emit("init", 1);
};


io.on("connection", (client) => {
  console.log("connect")
  client.on("keydown",(keyCode)=> handleKeydown(client,keyCode));
  client.on("newGame",()=> handleNewGame(client));
  client.on("joinGame",(roomName)=> handleJoinGame(client,roomName));  

  client.on('disconnect', () => {
    console.log("disconnect")
  });
});

const startGameInterval = (roomName) => {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) 
      emitGameState(roomName, state[roomName]);
     else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
};

const emitGameState = (room, gameState) => {
  // Send this event to everyone in the room.
  io.sockets.in(room)
  .emit("gameState", JSON.stringify(gameState));
};

const emitGameOver = (room, winner) => {
  io.sockets.in(room)
    .emit("gameOver", JSON.stringify({ winner }));
};

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
