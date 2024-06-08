import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup | any;
  register_endpoint = 'http://localhost:8080/api/v1/tutors/register';
  form_submitted = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    // TODO: Fix the default country in the form
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      phone_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
      birth_date: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&?]).{8,32}$/)
      ]),
      confirm_password: new FormControl('', [Validators.required]),
    });
  }
  async submitForm() : Promise<void> {
    if (this.registrationForm?.valid && this.passwordMatchValidator()) {
      // TODO add country to the request
      const request = {
        ...this.registrationForm.value,
      }
      delete request.country;
      delete request.confirm_password;
      delete request.first_name;
      delete request.last_name;
      request.name = this.registrationForm.value.first_name;
      request.surname = this.registrationForm.value.last_name;
      const res = await fetch(this.register_endpoint, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json();
      if (data.status === 200) {
        this.form_submitted = true;
        
      } else {
        // Tell user to try again
        alert('An error occured, please try again later.');
        console.error(data);
      }

    }

  }

  passwordMatchValidator() {
    return this.registrationForm.get('password').value === this.registrationForm.get('confirm_password').value
  }

  ngOnInit() {
    // const pwShowHide = document.querySelectorAll('.show-btn'),
    //   pwFields = document.querySelectorAll('.password'),
    //   showBtn = document.querySelector('#eye')

    // this.registrationForm = this.fb.group({
    //   username: ['', Validators.required],
    //   email: ['', Validators.required, Validators.email],
    //   name: ['', Validators.required],
    //   country: ['', Validators.required],
    //   phone_number: ['', Validators.required, Validators.pattern('[0-9]{10}')],
    //   birth_date: ['', Validators.required],
    //   password: [
    //     '',
    //     Validators.required,
    //     Validators.pattern(
    //       '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$'
    //     ),
    //   ],
    // });

    // Password Validation and icon toggle

    // Password Validation

    // Icon toggle
    // pwShowHide.forEach((eyeIcon) => {
    //   eyeIcon.addEventListener('click', () => {
    //     pwFields.forEach((pwField) => {
    //       if ((pwField as HTMLInputElement).type === 'password') {
    //         (pwField as HTMLInputElement).type = 'text';
    //         (showBtn as HTMLSpanElement).className = 'bi bi-eye-fill';
    //       } else {
    //         (pwField as HTMLInputElement).type = 'password';
    //         (showBtn as HTMLSpanElement).className = 'bi bi-eye-slash-fill';
    //       }
    //     });
    //   });
    // });
  }
}