import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css'
})
export class StudentLoginComponent {
  loginEndpoint = `${environment.API_URL}/users/login`;
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  constructor(private cookieService: CookieService, private router: Router) {
  }

  async logIn() {
    console.log("Logging in");
    // Get the email and password from the form
    const {email, password} = this.loginForm.value;
    const username = email;
    // Send POST request to the server
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
      this.router.navigate(['/student/dashboard']);
    } else {
      // Display an error message
      console.warn(data);
      alert(data.message);
      // TODO: Display error message in the HTML
    }
  }
}
