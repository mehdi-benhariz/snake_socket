import {Route} from "react-router-dom"
import socketIOClient from "socket.io-client";
import SocketContextProvider from "./components/context/SocketContext"
import GameBoard from "./components/GameBoard"

function App() {

  const socket = socketIOClient("http://localhost:5000");
  socket.on('init',(data)=>console.log(data))
  return (
    <SocketContextProvider>
      <Route exact path="/game" component={GameBoard} />
    <div className="App">
   socket      
    </div>
    </SocketContextProvider>

  );
}

export default App;
