import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  text = 'Login';
  valid_email = 'a.lucio@zentutor.ca';
  valid_password = "123"

  constructor() { }

  ngOnInit() {
    console.log("Login Component initialized");    
  }

  onLogin() {
    // Get the email and password from the form
    let email = (<HTMLInputElement>document.getElementsByName("email")[0]).value;
    let password = (<HTMLInputElement>document.getElementsByName("password")[0]).value;
    if (email === this.valid_email && password === this.valid_password) {
      // Redirect to the dashboard
      window.location.href = "/dashboard";
    } else {
      alert("Login failed");
    }
  }

}
