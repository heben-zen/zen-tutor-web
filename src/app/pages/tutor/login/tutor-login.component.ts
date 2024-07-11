import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UpperZenBannerComponent } from 'app/components/upper-zen-banner/upper-zen-banner.component';


@Component({
  selector: 'app-tutor-login',
  templateUrl: './tutor-login.component.html',
  styleUrls: ['./tutor-login.component.css'],
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, RouterLink, UpperZenBannerComponent]
})
export class TutorLoginComponent implements OnInit {
  loginEndpoint = `${environment.API_URL}/tutors/login`;
  constructor(private cookieService: CookieService, private router: Router) {
   }

  ngOnInit() {
    if (this.cookieService.check('token')) {
      // Redirect to the dashboard
      this.router.navigate(['/tutor/dashboard']);
    }
  }

  async onLogin() {
    // Get the email and password from the form
    let username = (<HTMLInputElement>document.getElementsByName("email")[0]).value;
    let password = (<HTMLInputElement>document.getElementsByName("password")[0]).value;
    // Send POST request to the server
    try {

      const res = await fetch(this.loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      })    
      const data = await res.json();
      // Check if the login was successful
      if (data.success === true){
        // Set the token cookie
        this.cookieService.set('token', data.token, undefined, '/');
        // Redirect to the dashboard
        this.router.navigate(['/tutor/dashboard']);
      }
    } catch (error) {
      console.error(error);
      // Display an error message
      alert(error);
    }
  }

}
