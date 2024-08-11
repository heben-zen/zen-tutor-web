import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../services/web-socket.service';
import { ChatRecipient } from 'app/models/chat-recipient';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Message } from 'app/models/message';

@Component({
  selector: 'app-messaging-chat',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './messaging-chat.component.html',
  styleUrl: './messaging-chat.component.css'
})
export class MessagingChatComponent implements OnInit {
  @Input() messages: Message[] = [];
  newMessage: string = '';
  @Input()
  recipient: ChatRecipient | null = null;
  @Input()
  closeChat : Function = () => {
    throw new Error('closeChat function not implemented');
  };
  @Input()
  chatID: number | undefined = undefined;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.messages.subscribe((message) => {
      console.log("Received message: " + message.text);
      const { senderID, recipientID, text, timestamp } = message;
      if (senderID === this.recipient?.id) {
        this.messages.push(message);
      }
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const message: Message = { 
        text: this.newMessage, 
        timestamp: new Date(), 
        recipientID: this.recipient?.id! , // Non-null assertion operator
        senderID: this.webSocketService.clientID! }; 
      console.log("Sending message: " + message);
      this.webSocketService.sendMessage(message);
      this.messages.push(message);
      this.newMessage = '';
    }
  }

}
