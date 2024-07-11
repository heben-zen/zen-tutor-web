import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NavigationBarComponent]
})
export class HomeComponent implements OnInit {
  title = 'Zen';

  constructor() { }

  ngOnInit() {

  }




}
