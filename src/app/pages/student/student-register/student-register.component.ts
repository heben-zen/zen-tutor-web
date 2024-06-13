import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css'
})
export class StudentRegisterComponent {
  registerEndpoint = `${environment.API_URL}/users/register`
  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    "first-name": new FormControl(''),
    "last-name": new FormControl(''),
    "phone-number": new FormControl(''),
    "birth-date": new FormControl('')
  });
  formSubmitted = false;
  constructor() {

  }

  // async concurrent 
  async register(){
    // TODO: Implement register logic
    const response = await fetch(this.registerEndpoint, {
      method: 'POST',
      body: JSON.stringify(this.registerForm.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to register')
    }
    this.formSubmitted = true;
  }
}
