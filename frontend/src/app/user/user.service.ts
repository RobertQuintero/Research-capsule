import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../environment/environment.service';
import { Observable } from 'rxjs';
import { IUser, IUserChangePassword, IUserRegister } from '../user/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private api: EnvironmentService) { }

  getToken() {
    let token = localStorage.getItem('access_token')
    let atoken = token?.replace(/"/g, '');
    return atoken
  }

  getFaculty(): Observable<IUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<IUser[]>(`${this.api.API_URL}/getFaculty`, {headers});
  }

  getRequest(): Observable<IUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<IUser[]>(`${this.api.API_URL}/getRequest`, {headers});
  }

  getApprovedFaculty(): Observable<IUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<IUser[]>(`${this.api.API_URL}/getApprovedFaculty`, {headers});
  }

  getCurrentUser(): Observable<IUser> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<IUser>(`${this.api.API_URL}/user/current`, {headers});
  }

  updateUserDetails(userDetails: IUser) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.api.API_URL}/user/details/update`, userDetails ,{headers});
  }

  updatePhoto(data: any) {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.api.API_URL}/user/photo/update`, data, {headers});
  }

  approveFaculty(id: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.api.API_URL}/user/approve/${id}`, null , {headers});
  }

  rejectFaculty(id: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.delete(`${this.api.API_URL}/user/reject/${id}`, {headers});
  }

  updatePassword(user: IUserChangePassword){
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.api.API_URL}/user/password/update`, user, {headers});
  }
}
