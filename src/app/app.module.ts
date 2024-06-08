import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/tutor/login/login.component';
import { RegisterComponent } from './pages/tutor/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavigationBarComponent } from './pages/home/navigation-bar/navigation-bar.component';
import { TutorDashboardComponent } from './pages/tutor/dashboard/tutor-dashboard.component';

// const appRoutes: Routes = [
//   { path: 'home', component: HomeComponent },
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: '**', component: HomeComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: LoginComponent },
// ];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavigationBarComponent,
    TutorDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  // constructor() {
  // //   FirebaseTSApp.init(environment.firebaseConfig);
  // }
}
