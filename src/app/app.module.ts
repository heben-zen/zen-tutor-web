import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'environments/environment';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const config: SocketIoConfig = { url: `${environment.VIDEO_WS_URI}:${environment.VIDEO_WS_PORT}`, options: {} };
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [CookieService, { provide: LocationStrategy, useClass: HashLocationStrategy }, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {

}
