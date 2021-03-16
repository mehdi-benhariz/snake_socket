import React, { createContext } from "react";
import socketIOClient from "socket.io-client";
export const SocketContext = createContext();

const SocketContextProvider = (props) => {
  const socket = socketIOClient("http://localhost:5000");

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.child}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
