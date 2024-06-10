import { Component, enableProdMode } from '@angular/core';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-server';
  constructor() {
    if (environment.production) {
      console.log("Production mode on");
      enableProdMode()
    }
  }
}
