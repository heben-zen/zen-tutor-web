import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  standalone: true,
  styleUrl: './student-login.component.css',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, RouterLink, NavigationBarComponent, ReactiveFormsModule]
})
export class StudentLoginComponent {
  loginEndpoint = `${environment.API_URL}/students/login`;
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
