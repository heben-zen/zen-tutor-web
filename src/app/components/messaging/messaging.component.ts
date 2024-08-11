import { Component, Input } from '@angular/core';
import { MessagingChatComponent } from './messaging-chat/messaging-chat.component';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { OnInit } from '@angular/core';
import { WebSocketService } from 'app/services/web-socket.service';
import { ChatRecipient } from 'app/models/chat-recipient';
import { OrderedSet } from 'js-sdsl';


@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [MessagingChatComponent],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.css'
})
export class MessagingComponent implements OnInit {
  // List of open chats
  @Input()
  recipients: OrderedSet<ChatRecipient> = new OrderedSet([], (a: ChatRecipient, b: ChatRecipient) => a.id! - b.id!);
  @Input()
  closeChat: Function = () => {
    throw new Error('closeChat function not implemented');
  };
  constructor(private cookieService: CookieService, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messages.subscribe((message) => {
      const { senderID, text, timestamp } = message;
      console.log("Got message from " + senderID + ": " + text);
        // Look up if the sender is already a recipient
        let sender = Array.from(this.recipients).find((recipient) => recipient.id === senderID);
        if (!sender) {
          // If the sender is not a recipient, create a new recipient
          fetch(`${environment.API_URL}/users/${senderID}`)
            .then((response) => response.json())
            .then((user) => {
              const sender: ChatRecipient = user
              sender.messages = [message];
              this.recipients.insert(sender);
            });
        }
    });
  }

    
}
