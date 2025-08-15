import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Logout {
  constructor(private http: HttpClient) {}
  logout() {

    // Optionally, you can also make an API call to log out from the server
    return this.http.post(environment.getUrl('logout','accounts'), {});
  }
}
