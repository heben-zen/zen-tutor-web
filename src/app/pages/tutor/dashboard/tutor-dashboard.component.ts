import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.css']
})
export class TutorDashboardComponent implements OnInit {

  constructor(private cookieService : CookieService, private router: Router) {
    // Check if the user is already logged in
    if (!this.cookieService.check('token')) {
      // Redirect to the login page
      this.router.navigate(['/tutor/login']);
    }

   }

  logOut() {
    // Remove the token cookie
    this.cookieService.delete('token', '/');
    this.router.navigate(['/tutor/login']);
  }


  ngOnInit(): void {
  }

}
