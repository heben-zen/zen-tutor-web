import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class NavigationBarComponent implements OnInit {
  @Input()
  showLogo: boolean = true;
  @Input()
  showPricing: boolean = true;
  @Input()
  showLogin: boolean = true;
  @Input()
  showTutorLogin: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
