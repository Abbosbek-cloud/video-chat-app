import React, { createContext } from "react";

const PeerContext = createContext(null);

export const usePeer = () => {
  return React.useContext(PeerContext);
};

const PeerProvider = (props) => {
  const peer = React.useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    await peer.setRemoteDescription(answer);
  };
  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAnswer }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
