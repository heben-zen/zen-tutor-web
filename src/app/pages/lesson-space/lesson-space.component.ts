import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'app/lesson-space/services/data.service';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const mediaConstraints = {
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 400, ideal: 720, max: 1080 },
  },
  audio: false,
};


const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

@Component({
  selector: 'app-lesson-space',
  standalone: true,
  imports: [],
  templateUrl: './lesson-space.component.html',
  styleUrl: './lesson-space.component.css'
})
export class LessonSpaceComponent implements AfterViewInit {
  @ViewChild('local_video') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remote_video') remoteVideo!: ElementRef<HTMLVideoElement>;
  private localStream!: MediaStream;
  private isCameraOn = true;
  private peerConnection!: RTCPeerConnection;
  inCall = false;
  constructor(private dataService: DataService ){}
  ngAfterViewInit(): void {
    // Initialize message handler
    this.addIncomingMessageHandler();
    this.requestMediaDevices();

  }
  
  private async requestMediaDevices() {
    this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  switchOnOffCamera() {
    this.localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    if (this.isCameraOn){
      this.localVideo.nativeElement.srcObject = null;
    } else this.localVideo.nativeElement.srcObject = this.localStream;
    this.isCameraOn = !this.isCameraOn;
  }

  switchOnOffMicrophone() {
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  async makeCall() : Promise<void> {
    this.createPeerConnection();
    this.localStream.getTracks().forEach(track=> this.peerConnection.addTrack(track, this.localStream));
    try {
      const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer(offerOptions);
      await this.peerConnection.setLocalDescription(offer);
      this.inCall = true;
      this.dataService.sendMessage({ type: 'offer', data: offer });
    } catch (error: any) {
      console.error('Error making call: ', error);
      this.handleCallError(error);
    }
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
      ],
    });
    this.peerConnection.onicecandidate = this.handleICECandidateEvent;
    this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }

  private closeVideoCall() {
    if (this.peerConnection){
      this.peerConnection.onicecandidate = null;
      this.peerConnection.onicegatheringstatechange = null;
      this.peerConnection.onsignalingstatechange = null;
      this.peerConnection.ontrack = null;

    }
    this.peerConnection.getTransceivers().forEach((transceiver) => {
      transceiver.stop();
    });
    this.peerConnection.close();
    this.peerConnection = null!;
  }

  handleCallError(error: Error) {
    switch (error.name) {
      case 'NotFoundError':
        alert('Unable to open your call because no camera and/or microphone were found');
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        break;
      default:
        alert('Error opening your camera and/or microphone: ' + error.message);
        break;
    }
    this.closeVideoCall();
  }

   /* ########################  EVENT HANDLER  ################################## */
   private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log(event);
    if (event.candidate) {
      this.dataService.sendMessage({
        type: 'ice-candidate',
        data: event.candidate
      });
    }
  }

  private handleICEConnectionStateChangeEvent = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handleSignalingStateChangeEvent = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handleTrackEvent = (event: RTCTrackEvent) => {
    console.log(event);
    this.remoteVideo.nativeElement.srcObject = event.streams[0];
  }

  private addIncomingMessageHandler() {
    this.dataService.connect();
    this.dataService.message.subscribe({
      next: (message) => {
        console.log('Received message of type: ' + message.type);
        switch (message.type) {
          case 'offer':
            this.handleOfferMessage(message.data);
            break;
          case 'answer':
            this.handleAnswerMessage(message.data);
            break;
          case 'hangup':
            this.handleHangupMessage(message);
            break;
          case 'ice-candidate':
            this.handleICECandidateMessage(message.data);
            break;
          default:
            console.log('Unrecognized message', message);
        }
      },
      error: (error) => {
        console.error('Error: ', error);
      },
      complete: () => {
        console.log('Connection closed');
      }
    });
  }
  
  /* ########################  MESSAGE HANDLER  ################################## */

  private handleOfferMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming offer');
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    if (!this.localStream) {
      this.switchOnOffCamera();
    }

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg))
      .then(() => {

        // add media stream to local video
        this.localVideo.nativeElement.srcObject = this.localStream;

        // add media tracks to remote connection
        this.localStream.getTracks().forEach(
          track => this.peerConnection.addTrack(track, this.localStream)
        );

      }).then(() => {

      // Build SDP for answer message
      return this.peerConnection.createAnswer();

    }).then((answer) => {

      // Set local SDP
      return this.peerConnection.setLocalDescription(answer);

    }).then(() => {

      // Send local SDP to remote party
      this.dataService.sendMessage({type: 'answer', data: this.peerConnection.localDescription});

      this.inCall = true;

    }).catch(this.handleCallError);
  }

  private handleAnswerMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming answer');
    this.peerConnection.setRemoteDescription(msg);
  }

  private handleHangupMessage(msg: any): void {
    this.closeVideoCall();
  }

  private handleICECandidateMessage(msg: RTCIceCandidate): void {
    const candidate = new RTCIceCandidate(msg);
    this.peerConnection.addIceCandidate(candidate).catch(this.reportError);
  }

  private reportError = (e: Error) => {
    console.log('Got Error: ', e);
  }

  hangUp() {
    this.dataService.sendMessage({ type: 'hangup' , data: null});
    this.closeVideoCall();
  }
}
