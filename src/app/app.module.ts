import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { TutorLoginComponent } from './pages/tutor/login/tutor-login.component';
import { StudentLoginComponent } from './pages/student/login/student-login.component';
import { RegisterComponent } from './pages/tutor/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavigationBarComponent } from './pages/home/navigation-bar/navigation-bar.component';
import { TutorDashboardComponent } from './pages/tutor/dashboard/tutor-dashboard.component';
import { CookieService } from 'ngx-cookie-service';
import { StudentRegisterComponent } from './pages/student/student-register/student-register.component';
import { StudentDashboardComponent } from './pages/student/student-dashboard/student-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'environments/environment';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


// const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
const config: SocketIoConfig = { url: `${environment.VIDEO_WS_URI}:${environment.VIDEO_WS_PORT}`, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TutorLoginComponent,
    StudentLoginComponent,
    RegisterComponent,
    StudentRegisterComponent,
    StudentDashboardComponent,
    NavigationBarComponent,
    TutorDashboardComponent
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
  providers: [CookieService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {

}
