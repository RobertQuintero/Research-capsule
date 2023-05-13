import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../environment/environment.service';
import { Observable } from 'rxjs';
import { IUser, IUserRegister } from '../user/iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient, private api: EnvironmentService) { }

  login(email: string, password: string) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
    const credentials = {
      email: email,
      password: password,
      grant_type: this.api.GRANT_TYPE,
      client_id: this.api.CLIENT_ID,
      client_secret: this.api.CLIENT_SECRET,
      scope: ''
    }
    return this.http.post(`${this.api.API_URL}/login`, credentials, { headers });
  }

  register(user: IUserRegister): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.api.API_URL}/register`, user, { headers });
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!!token) {
      return true
    }
    return false;
  }

  getToken() {
    let token = localStorage.getItem('access_token')
    let atoken = token?.replace(/"/g, '');
    return atoken
  }

  getUserLevel() {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.api.API_URL}/user/level`, { headers });

  }

  sendRequest(email: string) {
    return this.http.post(`${this.api.API_URL}/store`, { email: email, domain: this.api.DOMAIN_URL });
  }

  checkToken(token: string) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.api.API_URL}/token/check/${token}`, {
      headers,
    });
  }

  submitResetPassword(password: any, token: string) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    return this.http.post(
      `${this.api.API_URL}/password/reset/token/${token}`,
      password,
      { headers }
    );
  }

}
