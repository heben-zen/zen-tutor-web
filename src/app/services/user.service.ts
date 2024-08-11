import { Injectable } from '@angular/core';.
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor() { }

  async fetchUser(email: string): Promise<void> {
    const res = await fetch(`${this.API_URL}/users/${email}`)
    const user = await res.json()
    return user
  }
}
