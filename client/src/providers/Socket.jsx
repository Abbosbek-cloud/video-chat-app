import React, { createContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return React.useContext(SocketContext);
};

const SocketProvider = (props) => {
  const sockets = useMemo(() => io("http://localhost:5001"), []);
  return (
    <SocketContext.Provider value={{ sockets }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
