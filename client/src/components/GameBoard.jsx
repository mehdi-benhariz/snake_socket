import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "./context/SocketContext";

const GameBoard = () => {
  const { socket } = useContext(SocketContext);
  const { newG, gamecode } = useLocation().state;
  const [rows, setrows] = useState([]);
  let canvas, playerNumber;
  let gameActive = false;
  let gridsize;
  //init the screen
  socket.on("init", (number) =>{ 
    playerNumber = number
    console.log("init")
   for(var i =0;i<6;i++){
     var row = []
     for(var j=0;i<6;j++)
      row.push("")
    setrows([...rows,row])
   }
 console.log(rows)
  }
  );

  //get current state
  const handleGameState = (gameState) => {
    console.log("game state")
    if (!gameActive) return;
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => {
      console.log({ gameState })
      //set rows based on the game state
    });
  };
  //game over
  const handleGameOver = (data) => {
    if (!gameActive) return;

    data = JSON.parse(data);
    gameActive = false;
    if (data.winner === playerNumber) alert("You Win!");
    else alert("You Lose :(");
  };
  socket.on("gameState", handleGameState);
  socket.on("gameOver", handleGameOver);
  //on key down
  const keydown = (e) => {
    console.log(e.keyCode)
    socket.emit("keydown", e.keyCode);
    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
  };

  //setting the event listener
  useEffect(() => {
    document.addEventListener("keydown", keydown,false);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  },[]);
  //the screen
  const displayRows = rows.map((row) => (
    <li>
      {row.map((e) => {
        switch (e) {
          case "snake2":
            return (
              <div class="bg-red-500" height={gridsize} width={gridsize} />
            );
          case "snake1":
            return (
              <div class="bg-blue-500" height={gridsize} width={gridsize} />
            );
          case "food":
            return (
              <div class="bg-green-500" height={gridsize} width={gridsize} />
            );
            default:
              return (
                <div class="bg-gray-500" height={gridsize} width={gridsize} />
              );
        }
      })}
    </li>
  ));

  return (
    <div>
      <div id="gameScreen" class="h-100">
        <div class="d-flex flex-column align-items-center justify-content-center h-100">
          {newG && (
            <h1>
              Your game code is: <span id="gameCodeDisplay">{gamecode}</span>
            </h1>
          )}
          <canvas id="canvas">{displayRows}</canvas>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
