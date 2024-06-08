import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/tutor/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { EditProfile } from './pages/editprofile/editprofile.component';
import { RegisterComponent } from './pages/tutor/register/register.component';
import { TutorDashboardComponent } from './pages/tutor/dashboard/tutor-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'editprofile', component: EditProfile },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: TutorDashboardComponent },
  { path: '**', component: NotfoundComponent },
  // { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
];

@NgModule({
  imports: [
    // BrowserModule,
    RouterModule.forRoot(appRoutes),
    // HttpClientModule,
    // FormsModule,
    // ReactiveFormsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
