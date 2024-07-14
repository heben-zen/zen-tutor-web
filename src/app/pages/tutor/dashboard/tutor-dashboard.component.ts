import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LogInService } from 'app/services/log-in.service';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.css'],
  standalone: true,
  imports: [NavigationBarComponent]
})
export class TutorDashboardComponent implements OnInit {
  displayTutorLogIn: boolean = false;

  constructor(private cookieService : CookieService, private router: Router, private logInService: LogInService) {
    // Check if the user is already logged in
    if (!logInService.isLoggedIn()) {
      // Redirect to the login page
      this.router.navigate(['/tutor/login']);
    }
   }

  logOut() {
    // Remove the token cookie
    this.cookieService.delete('token', '/');
    this.cookieService.delete('username', '/');
    this.router.navigate(['/tutor/login']);
  }


  ngOnInit(): void {
  }

}
