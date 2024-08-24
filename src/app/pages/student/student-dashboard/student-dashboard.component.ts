import { Component } from '@angular/core';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LogInService } from 'app/services/log-in.service';
import { MessagingComponent } from 'app/components/messaging/messaging.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
  imports: [NavigationBarComponent, MessagingComponent]
})
export class StudentDashboardComponent {
  displayStudentLogIn: boolean = false;

  constructor(private cookieService : CookieService, private router: Router, private logInService: LogInService) {
    // Check if the user is already logged in
    logInService.isLoggedInAsStudent().then((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['/student/login']);
      }
    });
   }

  logOut() {
    // Remove the token cookie
    this.cookieService.delete('token', '/');
    this.cookieService.delete('username', '/');
    this.router.navigate(['/student/login']);
  }
}
