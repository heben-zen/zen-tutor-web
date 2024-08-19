import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterLink } from '@angular/router';
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

  constructor(private ls: LogInService) { 
    // Verify that the user is logged in
    ls.isLoggedInAsStudent().then((is_logged_in) => {
      if (!is_logged_in) {
        this.findATutorLink = "/tutors";
      }
    }).catch((err) => {
      console.log("Log in before continuing");
    });
  }

  ngOnInit() {

  }
}
