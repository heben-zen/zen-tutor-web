import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  tokenLogInEndpoint: string = `${environment.API_URL}/tutors/login`;

  constructor(private cookieService: CookieService) { }

  async isLoggedIn(): Promise<boolean> {
    // TODO: Implement Oauth token validation (JWT)
    const username = this.cookieService.get('username');
    const token = this.cookieService.get('token');
    if (!username || !token) return false;
    const res = await fetch(this.tokenLogInEndpoint, {
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
}
