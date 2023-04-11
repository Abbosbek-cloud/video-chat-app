import React from "react";
import { useNavigate } from "react-router-dom";
import { usePeer } from "../providers/Peer";
import { useSocket } from "../providers/Socket";

const RoomId = () => {
  const { sockets } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer } = usePeer();

  const handleNewUser = React.useCallback(
    async (data) => {
      const { emailId } = data;
      const offer = await createOffer();
      console.log("New user joined into group");
      sockets.emit("call-user", { emailId, offer });
    },
    [createOffer, sockets]
  );

  const handleIncomingCall = React.useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call from ", from, offer);
      const answer = await createAnswer(offer);
      sockets.emit("call-accepted", { emailId: from, answer });
    },
    [createAnswer, sockets]
  );

  const handleCallAccepted = React.useCallback(
    async (data) => {
      console.log(data, "accepted");
      const { answer } = data;
      console.log("call accepted", answer);
      await setRemoteAnswer(answer);
    },
    [setRemoteAnswer]
  );

  React.useEffect(() => {
    sockets.on("user-joined", handleNewUser);
    sockets.on("incoming-call", handleIncomingCall);
    sockets.on("call-accepted", handleCallAccepted);
    return () => {
      sockets.off("user-joined", handleNewUser);
      sockets.off("incoming-call", handleIncomingCall);
      sockets.off("call-accepted", handleCallAccepted);
    };
  }, [sockets, handleNewUser, handleIncomingCall, handleCallAccepted]);

  return <div>RoomId</div>;
};

export default RoomId;
