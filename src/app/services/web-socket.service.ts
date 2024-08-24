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
    this.initializeUserID()
      .then((success: Boolean) => {
        if (!success) {
          throw new Error('User not logged in');
        }
        console.log("Connecting to server");
        this.socket = io(`${this.MessagingSocketIOURI}:${this.MessagingPORT}?id=${this.clientID}`);
        this.socket.on('connect', () => {
          console.log('Connected to server');
        });
        this.socket.on('message', (message: any) => {
          console.log('Received message from server');
          this.messageSubject.next(message);
        });
        this.socket.on('disconnect', () => {
          console.log('Disconnected from server');
        });
      })
      .catch((error) => {
        console.error("Failed to start real time messaging")
        console.error(error);
      });
  }

  sendMessage(message: any): void {
    this.socket.send(message);
  }

  private async initializeUserID(): Promise<Boolean> {
    const username = this.cookieService.get('username');
    if (!username) {
      return false;
    }
    return fetch(`${this.API_URL}/users/${username}`)
      .then((response) => response.json())
      .then((data) => {
        this.clientID = data.id;
        console.log("ClientID set to " + this.clientID);
        return true;
      });
  }

}