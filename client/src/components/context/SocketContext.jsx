import React, { createContext } from 'react';
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketContextProvider = (props) => {
    const socket = io(process.env.REACT_APP_URL)


    return ( 
        <SocketContext.Provider value={{socket}} >
            {props.children}
        </SocketContext.Provider>   );
}
 
export default SocketContextProvider;