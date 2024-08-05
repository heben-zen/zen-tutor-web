import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  tutorTokenLogInEndpoint: string = `${environment.API_URL}/tutors/login`;
  studentTokenLogInEndpoint: string = `${environment.API_URL}/students/login`;

  constructor(private cookieService: CookieService) { }

  async isLoggedInAsTutor(): Promise<boolean> {
    // TODO: Implement Oauth token validation (JWT)
    const username = this.cookieService.get('username');
    const token = this.cookieService.get('token');
    if (!username || !token) return false;
    const res = await fetch(this.tutorTokenLogInEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, token }),
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  async isLoggedInAsStudent(): Promise<boolean> {
    // TODO: Implement Oauth token validation (JWT)
    const username = this.cookieService.get('username');
    const token = this.cookieService.get('token');
    if (!username || !token) return false;
    const res = await fetch(this.studentTokenLogInEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, token }),
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  getUsername(): string {
    return this.cookieService.get('username');
  }

  getUserID(): number {
    return parseInt(this.cookieService.get('userID'));
  }
}
