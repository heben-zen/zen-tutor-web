import { Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

const tutorsURI = `${environment.API_URL}/tutors`
interface Tutor {
  id: number;
  name: string;
  surname: string;
  email: string;
  bio: string;
  profile_picture_name: string;
  enabled: boolean;
}

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [MatListModule, CommonModule, MatSidenavModule, MatExpansionModule, MatIconModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './tutors.component.html',
  styleUrl: './tutors.component.css'
})
export class TutorsComponent {
  tutors: Tutor[] = []; // Placeholder for fetched data
  selectedTutor: Tutor | null = null;
  uploadsFolder = environment.API_URL + '/uploads/';
  
  
  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.fetchTutors();
  }

  async fetchTutors() {
    this.http.get(tutorsURI)
      .subscribe((tutors: any) => {
        console.log(tutors);
        this.tutors = tutors;
      });
  }

  selectTutor(tutor: Tutor) {
    this.selectedTutor = tutor;
  }
}
