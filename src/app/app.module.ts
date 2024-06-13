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
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {
  // constructor() {
  // //   FirebaseTSApp.init(environment.firebaseConfig);
  // }
}
