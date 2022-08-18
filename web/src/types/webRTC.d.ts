export interface IvcProps{
  roomID: string;
}

export interface IpeerConnections{
    current: {
      [key: string]: RTCPeerConnection
    }
  }
export interface IpeerMediaElements{
    current: {
      [key: string]: HTMLVideoElement,
    }
  }

export interface IRTCSessionDescriptionInit{
    sdp?: string;
    type: 'answer' | 'offer' | 'pranswer' | 'rollback';
  }

export interface IlocalMediaStream{
    current: MediaStream | null
  }
