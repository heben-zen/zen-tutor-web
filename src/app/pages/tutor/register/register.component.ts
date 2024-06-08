import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup | any;
  register_endpoint = 'localhost:8080/api/v1/tutor/register';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    // TODO: Fix the default country in the form
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      country: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      birth_date: ['', Validators.required],
      password: [
        '',
        [Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&?]).{8,32}$/
        )]
      ],
      confirm_password: ['', Validators.required],
    });
  }
  submitForm(): void {
    if (this.registrationForm?.valid) {
      console.log('Form data:', this.registrationForm.value);
    }
  }

  test() {
    console.log('Form data:', this.registrationForm.value);
    console.log('Is valid: ', this.registrationForm.valid);
  
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
