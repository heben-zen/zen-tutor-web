import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { Router, RouterLink } from '@angular/router';
import { LogInService } from "../../services/log-in.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NavigationBarComponent, RouterLink]
})
export class HomeComponent implements OnInit {
  title = 'Zen';
  findATutorLink = "/student/login";
  registerTutorLink = "/tutor/register";
  @ViewChild('tutorRegistrationEmail') tutorRegistrationEmail!: ElementRef<HTMLInputElement>;
  

  constructor(private ls: LogInService, private router: Router) { 
    // Verify that the user is logged in
    ls.isLoggedInAsStudent().then((is_logged_in) => {
      if (is_logged_in) {
        this.findATutorLink = "/tutors";
      }
    }).catch((err) => {
      console.log("Log in before continuing");
    });
  }

  ngOnInit() {

  }

  onTutorRegister(email: string) {
    // Redirect to register page with query param
    this.router.navigate([this.registerTutorLink], { queryParams: { email: email } });

  }
}
