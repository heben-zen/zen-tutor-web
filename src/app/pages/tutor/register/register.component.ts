import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [NavigationBarComponent, ReactiveFormsModule]
})
export class RegisterComponent{
  registrationForm: FormGroup | any;
  register_endpoint = `${environment.API_URL}/tutors/register`;
  form_submitted = false;
  selectedProfilePicture: File | null = null;
  selectedProfilePictureURI: string | null = null;

  constructor(private http: HttpClient) {
    // TODO: Fix the default country in the form
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      bio: new FormControl(''),
      country: new FormControl('', Validators.required),
      subjects: new FormControl('', Validators.required),
      phone_number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10,14}')]),
      birth_date: new FormControl('', Validators.required),
      profile_picture: new FormControl(),
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
      const new_tutor = {
        ...this.registrationForm.value,
      }
      delete new_tutor.country;
      delete new_tutor.confirm_password;
      delete new_tutor.first_name;
      delete new_tutor.last_name;
      new_tutor.name = this.registrationForm.value.first_name;
      new_tutor.surname = this.registrationForm.value.last_name;
      const formData = new FormData();
      if (this.selectedProfilePicture) {
        formData.append('profile_picture', this.selectedProfilePicture as File, this.selectedProfilePicture?.name);
      }
      formData.append('tutor', new Blob([JSON.stringify(new_tutor)], {type: 'application/json'}));
      // formData.append('tutor', JSON.stringify(new_tutor));
      console.log(formData);
      try {
        const response = await fetch(this.register_endpoint, {
          method: 'POST',
          body: formData,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // }
        })
        if (response.ok) {
          this.form_submitted = true;
        } else {
          const error = await response.json()
          alert(error.error);
        }
      } catch (error) {
          console.error(error);
          alert(error);
        };
    }

  }

  passwordMatchValidator() {
    return this.registrationForm.get('password').value === this.registrationForm.get('confirm_password').value
  }

  onFileSelected(event: Event): void{
    const input = event.target as HTMLInputElement;
    try {
      if (input.files && input.files.length) {
        this.selectedProfilePicture = input.files[0];
        // Image no greater than 96 kilobytes
        if (this.selectedProfilePicture.size > 96 * 1024) {
          throw new Error(`Image size too large, make sure it's 96 KB or smaller`);
        }
        this.selectedProfilePictureURI = URL.createObjectURL(this.selectedProfilePicture);
      } else {
        this.selectedProfilePicture = null;
        this.selectedProfilePictureURI = null;
      }
    } catch (error) {
      alert(error);
    }
  }

}