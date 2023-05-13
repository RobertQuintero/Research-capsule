import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../environment/environment.service';
import { Observable } from 'rxjs';
import {ICapsule} from './icapsule'

interface assignObject {
  user_id: number
  capsule_id: number
}

@Injectable({
  providedIn: 'root'
})
export class CapsuleService {

  constructor(private http: HttpClient, private api: EnvironmentService) { }

  getToken() {
    let token = localStorage.getItem('access_token')
    let atoken = token?.replace(/"/g, '');
    return atoken
  }

  getCapsules(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<any>(`${this.api.API_URL}/capsule/list`, {headers})
  }

  getAvailableReviewers(id: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<any>(`${this.api.API_URL}/capsule/availableReviewers/${id}`, {headers})
  }

  assignReviewer(assignObject: assignObject): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post<any>(`${this.api.API_URL}/review/store`, assignObject, {headers})
  }
}
