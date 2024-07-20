import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LogInService } from 'app/services/log-in.service';


@Component({
  selector: 'app-tutor-login',
  templateUrl: './tutor-login.component.html',
  styleUrls: ['./tutor-login.component.css'],
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, RouterLink, NavigationBarComponent, ReactiveFormsModule]
})
export class TutorLoginComponent implements OnInit {
  loginEndpoint = `${environment.API_URL}/tutors/login`;
  credentialsForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  isLoggedIn: boolean = false;
  constructor(private cookieService: CookieService, private router: Router, private http: HttpClient, private logInService: LogInService) {
   }

  ngOnInit() {
    this.logInService.isLoggedInAsTutor().then((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) this.router.navigate(['/tutor/dashboard']);
    });
  }

  async onLogin() {    
    const credentials = { 
      username: this.credentialsForm.get('email')?.value,
      password: this.credentialsForm.get('password')?.value
    }
    try {
        const res = await fetch(this.loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        const token = await res.text();
        if (res.ok) {
          this.cookieService.set('token', token);
          this.cookieService.set('username', credentials.username!);
          this.router.navigate(['/tutor/dashboard']);
        } else {
          alert(token);
        }
    } catch (error) {
      console.error(error);
      // Display an error message
      alert(error);
    }
  }

}
