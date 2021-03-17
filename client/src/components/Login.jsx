import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "./context/SocketContext";
const Login = () => {
  const [code, setcode] = useState("");
  const { socket } = useContext(SocketContext);
  let history = useHistory();

  const joinGame = (e) => {
    e.preventDefault();
    socket.emit("joinGame", code);

    history.push({
        pathname:"/game",
        state:{
            newG: false,
        }
    });
  };

  const newGame = (e) => {
    e.preventDefault();
    socket.emit("newGame");
    socket.on('gameCode', (gamecode)=>{
        history.push( {
            pathname:"/game",
            state:{
                newG: true,
                gamecode
            }
        });
    });

  };

  return (
    <div class=" flex h-screen">
      <div class="m-auto  ">
        <div class="bg-gray-200 shadow-md rounded p-10">
          <div class="flex justify-center">
            <button
              class="bg-green-450 text-2xl text-white px-8 py-3 rounded outline-none hover:bg-green-600
           transform ease-linear duration-150 mb-3 text-center "
              onClick={(e) => newGame(e)}
            >
              Create a Game
            </button>
          </div>
          <p class="text-lg text-gray-500 mb-3 text-center">
            Or Login to an Existing One
          </p>
          <div class="flex justify-center">
            <input
              type="text"
              placeholder="code..."
              class=" px-8 py-3 `bg-gray-200 rounded  hover:shadow-xl transform ease-linear duration-150 
           focus:bg-white border-transparent focus:border-green-400 border-2 outline-none mb-2 mr-4"
              onChange={(e) => setcode(e.target.value)}
            />
            <button
              class="bg-green-450 text-2xl text-white px-8 py-3 rounded outline-none hover:bg-green-600
           transform ease-linear duration-150 mb-3 text-center "
              onClick={(e) => joinGame(e)}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
