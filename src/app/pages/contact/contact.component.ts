import { Component } from '@angular/core';
import { NavigationBarComponent } from '../home/navigation-bar/navigation-bar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const ContactMessageEndpoint = environment.API_URL + '/contact/msgs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavigationBarComponent, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = new FormGroup({
    name: new FormControl(''),
    company: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl('')
  });
  formSubmitted = false;

  constructor(private http: HttpClient) { }

  sendMessage(){
    const formData = new FormData();
    Object.keys(this.contactForm.controls).forEach(key => {
      formData.append(key, this.contactForm.get(key)?.value);
    });
    this.http.post(ContactMessageEndpoint, formData)
    this.formSubmitted = true;
  }
}
