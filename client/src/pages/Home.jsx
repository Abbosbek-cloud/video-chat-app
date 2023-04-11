import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/Socket";

const Home = () => {
  const { sockets } = useSocket();
  const navigate = useNavigate();
  const [data, setData] = React.useState({ emailId: "", roomId: "" });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSocketJoinedRoom = React.useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  React.useEffect(() => {
    sockets.on("entered-room", handleSocketJoinedRoom);
    return () => {
      sockets.off("entered-room", handleSocketJoinedRoom);
    };
  }, [sockets, handleSocketJoinedRoom]);

  const handleJoinRoom = () => {
    sockets.emit("enter-room", { ...data });
  };

  console.log(sockets);
  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          onChange={handleChange}
          value={data.emailId}
          name="emailId"
          type="email"
          placeholder="Enter your email..."
        />
        <input
          onChange={handleChange}
          value={data.roomId}
          name="roomId"
          type="text"
          placeholder="Enter Room Code"
        />
        <button onClick={handleJoinRoom}>Enter</button>
      </div>
    </div>
  );
};

export default Home;
