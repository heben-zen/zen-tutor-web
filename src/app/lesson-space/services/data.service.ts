import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from '../types/message';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export const WS_ENDPOINT = `${environment.VIDEO_WS_URI}:${environment.VIDEO_WS_PORT}`;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private socket!: WebSocketSubject<Message>;
  private messageSubject = new Subject<Message>();
  public message = this.messageSubject.asObservable();
    /**
   * Creates a new WebSocket subject and send it to the message subject
   * @param cfg if true the observable will be retried.
   */
  public connect(): void {
    // if (!this.socket || this.socket.closed) {
      this.socket = this.getNewWebSocket();
      this.socket.subscribe(
        // Called whenever there is a message from the server
        msg => {
          console.log('Received message of type: ' + msg.type);
          this.messageSubject.next(msg);
        }
      );
    // }
  }

  sendMessage(message: Message): void {
    console.log("Sending message: ", message);
    this.socket.next(message);  
  }

  private getNewWebSocket(): WebSocketSubject<Message> {
    return new WebSocketSubject({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('WebSocket connection has been established');
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket connection has been closed');
          this.socket = null!;
          this.connect();
        }
      },
      // deserializer: (e) => {
      //   // console.log("Deserializing: ");
      //   // console.log(e);
      //   // const data = e.data.text().then((text: string) => {
      //   //   return JSON.parse(text);
      //   // })
      //   return e.data.text().then((text: string) => {
      //     return JSON.parse(text);
      //   }
      //   )
      // },
      // serializer: (value) => {
      //   console.log("Serializing: ");
      //   return JSON.stringify(value)
      // }
    });
  }
}