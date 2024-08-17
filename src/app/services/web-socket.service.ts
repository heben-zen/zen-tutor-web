import { Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket = io();
  private messageSubject = new Subject<any>();
  public messages = this.messageSubject.asObservable();
  private MessagingSocketIOURI = environment.MESSAGING_URI;
  private MessagingPORT = environment.MESSAGING_PORT;
  private API_URL = environment.API_URL;
  @Input()
  public clientID: number | null = null;

  constructor(private cookieService: CookieService) {
    console.log(`Connecting to server ${this.MessagingSocketIOURI}:${this.MessagingPORT}`);
    this.initializeUserID()
      .then(() => {
        console.log("Connecting to server");
        this.socket = io(`${this.MessagingSocketIOURI}:${this.MessagingPORT}?id=${this.clientID}`);
        this.socket.on('connect', () => {
          console.log('Connected to server');
        });
        this.socket.on('message', (message: any) => {
          console.log('Received message from server');
          this.messageSubject.next(message);
        });
      }).catch((error) => {
        console.error(error)
        console.log("Could not connect to messaging server");
        });
  }

  sendMessage(message: any): void {
    this.socket.send(message);
  }

  async initializeUserID(): Promise<void> {
    console.log("Initializing UserID");
    const username = this.cookieService.get('username');
    if (!username) throw new Error('Not logged in');
    return fetch(`${this.API_URL}/users/${username}`)
      .then((response) => response.json())
      .then((data) => {
        this.clientID = data.id;
        console.log("ClientID set to " + this.clientID);
      });
  }

}