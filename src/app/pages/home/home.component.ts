import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NavigationBarComponent, RouterLink]
})
export class HomeComponent implements OnInit {
  title = 'Zen';

  constructor() { }

  ngOnInit() {

  }




}
