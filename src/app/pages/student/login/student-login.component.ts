import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';
import { LogInService } from 'app/services/log-in.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  standalone: true,
  styleUrl: './student-login.component.css',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, RouterLink, NavigationBarComponent, ReactiveFormsModule]
})
export class StudentLoginComponent implements OnInit{
  loginEndpoint = `${environment.API_URL}/students/login`;
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  isEmailConfirmed = false;
  constructor(private cookieService: CookieService,
    private router: Router,
    private logInService: LogInService,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    // Check if the user is already logged in
    console.log("Checking if user is already logged in");
    this.logInService.isLoggedInAsStudent().then(isLoggedIn => {
      if (isLoggedIn) {
        // Redirect to the dashboard
        this.router.navigate(['/student/dashboard']);
      } else console.log("Student is not logged in");
    });
    // Check if the email was confirmed
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) return;
      fetch(`${environment.API_URL}/registration/confirm-account?token=${token}`)
        .then(res => {
          if (res.ok) {
            this.isEmailConfirmed = true;
          }
        })
    })
  }

  async logIn() {
    // Get the email and password from the form
    const {email,
      password} = this.loginForm.value;
    const username : string = email ?? "";
    // Send POST request to the server
    const payload = JSON.stringify({username, password})
    const res = await fetch(this.loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })    
    const token = await res.text();
    // Check if the login was successful
    if (res.ok){
      // Set the token cookie
      this.cookieService.set('token', token);
      this.cookieService.set('username', username);
      // Redirect to the dashboard
      this.router.navigate(['/student/dashboard']);
    } else {
      // Display an error message
      console.warn('Login failed');
      alert(res.status)
      // TODO: Display error message in the HTML
    }
  }
}
