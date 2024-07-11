import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TutorLoginComponent } from './pages/tutor/login/tutor-login.component';
import { StudentLoginComponent } from './pages/student/login/student-login.component';
import { StudentRegisterComponent } from './pages/student/student-register/student-register.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { EditProfile } from './pages/editprofile/editprofile.component';
import { RegisterComponent } from './pages/tutor/register/register.component';
import { TutorDashboardComponent } from './pages/tutor/dashboard/tutor-dashboard.component';
import { StudentDashboardComponent } from './pages/student/student-dashboard/student-dashboard.component';
import { LessonSpaceComponent } from './pages/lesson-space/lesson-space.component';
import { TutorsComponent } from './pages/tutors/tutors.component';
import { ContactComponent } from './pages/contact/contact.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'student/login', component: StudentLoginComponent },
  { path: 'student/register', component: StudentRegisterComponent},
  { path: 'student/dashboard', component: StudentDashboardComponent},
  { path: 'tutor/login', component: TutorLoginComponent },
  { path: 'tutor/register', component: RegisterComponent},
  { path: 'tutor/dashboard', component: TutorDashboardComponent },
  { path: 'tutors', component: TutorsComponent},
  { path: 'editprofile', component: EditProfile },
  { path: 'lesson-space', component: LessonSpaceComponent},
  { path: 'contact', component: ContactComponent},
  { path: '**', component: NotfoundComponent }
  // { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
