/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
import { useEffect, useRef, useCallback } from 'react';
import freeice from 'freeice';
import useStateWithCallback from './useStateWithCallback';
import socket from '../socket';
import ACTIONS from '../actions/wsActions';
import {
  IlocalMediaStream,
  IpeerConnections,
  IpeerMediaElements,
  IRTCSessionDescriptionInit,
} from '../types/webRTC';
import { useAppSelector } from './redux';

export const LOCAL_VIDEO: string = socket.id;

export default function useWebRTC(roomID: string) {
  const game = useAppSelector((store) => store.game);
  // const MY_VIDEO: string = socket.id;
  const [clients, updateClients] = useStateWithCallback([]);

  const addNewClient = (newClient: string, cb: () => void) => {
    updateClients((list: Array<string>) => {
      // console.log('list: ', list);
      if (!list.includes(newClient)) {
        return [...list, newClient];
      }

      return list;
    }, cb);
  };

  const peerConnections: IpeerConnections = useRef({});
  const localMediaStream: IlocalMediaStream = useRef(null);
  const peerMediaElements: IpeerMediaElements = useRef({});

  useEffect(() => {
    async function handleNewPeer({
      peerID,
      createOffer,
    }: {
      peerID: string;
      createOffer: boolean;
    }) {
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`);
      }

      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      peerConnections.current[peerID].onicecandidate = (
        event: RTCPeerConnectionIceEvent,
      ) => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      };

      let tracksNumber = 0;
      peerConnections.current[peerID].ontrack = ({
        streams: [remoteStream],
      }) => {
        tracksNumber += 1;

        if (tracksNumber === 2) {
          //
          tracksNumber = 0;
          addNewClient(peerID, () => {
            if (peerMediaElements.current[peerID]) {
              peerMediaElements.current[peerID].srcObject = remoteStream;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                if (peerMediaElements.current[peerID]) {
                  peerMediaElements.current[peerID].srcObject = remoteStream;

                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        }
      };

      localMediaStream.current?.getTracks().forEach((track) => {
        if (localMediaStream.current) {
          peerConnections.current[peerID].addTrack(
            track,
            localMediaStream.current,
          );
        }
      });

      if (createOffer) {
        const offer = await peerConnections.current[peerID].createOffer();

        await peerConnections.current[peerID].setLocalDescription(offer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        });
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.off(ACTIONS.ADD_PEER);
    };
  }, []);

  useEffect(() => {
    async function setRemoteMedia({
      peerID,
      sessionDescription: remoteDescription,
    }: {
      peerID: string;
      sessionDescription: IRTCSessionDescriptionInit;
    }) {
      await peerConnections.current[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription),
      );

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);

    return () => {
      socket.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate),
      );
    });

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({ peerID }: { peerID: string }) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients((list: Array<string>) =>
        // console.log(list, 'лист');
        // console.log('peerID: ', peerID);
        list.filter((c) => c !== peerID));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.off(ACTIONS.REMOVE_PEER);
    };
  }, [game.videoComponents]);

  useEffect(() => {
    async function startCapture() {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      });

      addNewClient(socket.id, () => {
        const localVideoElement = peerMediaElements.current[socket.id];

        if (localVideoElement) {
          localVideoElement.volume = 0;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    }

    startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, { room: roomID }))
      .catch((e) => console.error('Error getting userMedia:', e));

    return () => {
      localMediaStream.current?.getTracks().forEach((track) => track.stop());
      socket.emit(ACTIONS.LEAVE);
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id: string, node: HTMLVideoElement) => {
    peerMediaElements.current[id] = node;
  }, []);

  return {
    clients,
    provideMediaRef,
  };
}
