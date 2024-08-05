import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LogInService } from 'app/services/log-in.service';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';
import { MessagingComponent } from 'app/components/messaging/messaging.component';
import { ChatRecipient } from 'app/models/chat-recipient';

@Component({
  selector: 'app-dashboard',
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.css'],
  standalone: true,
  imports: [NavigationBarComponent, MessagingComponent]
})
export class TutorDashboardComponent implements OnInit {
  displayTutorLogIn: boolean = false;
  recipients: Set<ChatRecipient> = new Set<ChatRecipient>();
  closeChat: Function = (chat: ChatRecipient) => {
    this.recipients.delete(chat)
  }

  constructor(private cookieService : CookieService, private router: Router, private logInService: LogInService) {
    // Check if the user is already logged in
    logInService.isLoggedInAsTutor().then((isLoggedIn) => {
      if (!isLoggedIn) {
        // Redirect to the login page
        this.router.navigate(['/tutor/login']);
      }});
   }

  logOut() {
    // Remove the token cookie
    this.cookieService.delete('token', '/');
    this.cookieService.delete('username', '/');
    this.router.navigate(['/tutor/login']);
  }


  ngOnInit(): void {
  }

  openChat() {
    
  }

}
