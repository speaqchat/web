import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Socket } from "socket.io-client";

const VideoCall = ({ socket }: { socket: Socket }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerInstance = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      const getUserMedia = navigator.mediaDevices.getUserMedia;

      getUserMedia({ video: true, audio: true }).then(
        (mediaStream: MediaStream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
          }
          call.answer(mediaStream);
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        }
      );
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId: any) => {
    var getUserMedia = navigator.mediaDevices.getUserMedia;

    getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      if (!currentUserVideoRef.current || !peerInstance.current) return;
      currentUserVideoRef.current.srcObject = mediaStream;

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        if (!remoteVideoRef.current) return;
        remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  return (
    <div className="bg-primary-dark h-screen text-white">
      <h1 className="select-text">Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div className="w-full flex justify-between container mx-auto">
        <div>
          <video
            className="h-96 rounded-md shadow border-tertiary-dark"
            autoPlay
            muted
            ref={currentUserVideoRef}
          />
        </div>
        <div>
          <video
            className="h-96 rounded-md shadow border-tertiary-dark"
            autoPlay
            ref={remoteVideoRef}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
