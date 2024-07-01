import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'app/lesson-space/services/data.service';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';

const mediaConstraints = {
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 400, ideal: 720, max: 1080 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
};

const screenShareConstraints = {
  video: {
    cursor: 'always',
  },
  audio: false
};


const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

@Component({
  selector: 'app-lesson-space',
  standalone: true,
  imports: [MatSlideToggleModule, MatSlideToggle, MatButtonModule],
  templateUrl: './lesson-space.component.html',
  styleUrl: './lesson-space.component.css'
})
export class LessonSpaceComponent implements AfterViewInit {
  @ViewChild('local_video') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remote_video') remoteVideo!: ElementRef<HTMLVideoElement>;
  private localStream!: MediaStream;
  private localStreamScreen!: MediaStream;

  private originalVideoTrack!: MediaStreamTrack | null;

  isCameraOn = true;
  isAudioOn = true;
  isScreenSharingOn = false;
  private peerConnection!: RTCPeerConnection;
  inCall = false;
  constructor(private dataService: DataService ){}
  ngAfterViewInit(): void {
    // Initialize message handler
    this.addIncomingMessageHandler();
    this.requestMediaDevices();
    this.localVideo.nativeElement.volume = 0;
  }
  
  private async requestMediaDevices() {
    this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    this.localVideo.nativeElement.srcObject = this.localStream;
  }
  
  private async requestScreenSharing() {
    const openScreenMediaDevice = async (constraints: object) =>
      await navigator.mediaDevices.getDisplayMedia(constraints);
    try {
      this.localStreamScreen = await openScreenMediaDevice(screenShareConstraints);
      this.localVideo.nativeElement.srcObject = this.localStreamScreen;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
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
    this.isAudioOn = !this.isAudioOn;
  }

  async switchOnOffScreenSharing() {
    
    if (!this.isScreenSharingOn) { // Screen sharing is off
      await this.requestScreenSharing();
      if (this.inCall) {
        const newTrack = this.localStreamScreen.getVideoTracks()[0]
        if(newTrack.kind !== 'video')
          throw new Error('Eek!?');
        const senders = this.peerConnection.getSenders();
        if (this.isCameraOn){
          // Replace video track with screen sharing track
          senders.forEach(async (sender) => {
            if (sender.track?.kind === 'video') {
              if (!this.originalVideoTrack) {
                this.originalVideoTrack = sender.track;
              }
              await sender.replaceTrack(newTrack);
              newTrack.onended = () => {
                if (this.originalVideoTrack) {
                  sender.replaceTrack(this.originalVideoTrack).then(() => {
                    // Update the local stream and UI as necessary
                    this.localVideo.nativeElement.srcObject = this.localStream;
                    // Reset the originalVideoTrack to null if you want to allow future screen shares
                    this.originalVideoTrack = null;
                    // Update any flags or UI elements to reflect that screen sharing has ended
                    this.isScreenSharingOn = false;
                  }).catch(error => console.error("Error replacing track:", error));
                }
              }
            }
          });
        }
        
      }
    } else if (this.isCameraOn) { // Screen sharing is on and camera is on
      this.localVideo.nativeElement.srcObject = this.localStream;
      this.localStreamScreen.getTracks().forEach(track => {
        track.stop()
        track.dispatchEvent(new Event("ended"));
      });

    } else { // Screen sharing is on and camera is off
      this.localVideo.nativeElement.srcObject = null;
    }
    this.isScreenSharingOn = !this.isScreenSharingOn;
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
    this.inCall = false;
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
