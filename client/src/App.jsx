import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SocketProvider from "./providers/Socket";
import RoomId from "./pages/RoomId";
import PeerProvider from "./providers/Peer";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<RoomId />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
