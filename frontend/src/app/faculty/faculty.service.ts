import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../environment/environment.service';
import { Observable } from 'rxjs';
import { IUser, IUserRegister } from '../user/iuser';
import { ICapsule } from '../capsule/icapsule';

interface ICapsuleResponse {
  data: ICapsule[]
  message?: string
}

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private http: HttpClient, private api: EnvironmentService) { }

  getToken() {
    let token = localStorage.getItem('access_token')
    let atoken = token?.replace(/"/g, '');
    return atoken
  }
  getUserCapsules(): Observable<ICapsule[]> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<ICapsule[]>(`${this.api.API_URL}/faculty/getCapsules`, { headers });
  }
  addCapsule(capsule: any): Observable<ICapsuleResponse> {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<ICapsuleResponse>(`${this.api.API_URL}/faculty/addCapsule`, capsule, { headers })
  }
  editCapsule(editCapsule: any): Observable<ICapsuleResponse> {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<ICapsuleResponse>(`${this.api.API_URL}/faculty/editCapsule`, editCapsule, { headers })
  }
  assignedCapsules(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<any>(`${this.api.API_URL}/faculty/assignedCapsules`, { headers })
  }
  reviewCapsule(review: any): Observable<any> {
    console.log(review.get('grade'), review.get('comment'), review.get('capsule_id'))
    const reviewObject = {
      grade: review.get('grade'),
      comment: review.get('comment'),
      capsule_id: review.get('capsule_id')
    }
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post<any>(`${this.api.API_URL}/faculty/reviewCapsule`, reviewObject, { headers })
  }
  rejectCapsule(data: any) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<any>(`${this.api.API_URL}/faculty/rejectCapsule`, data, { headers })
  }

  unreviseCapsule(data: any) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<any>(`${this.api.API_URL}/faculty/unreviseCapsule`, data, { headers })
  }

  reviseCapsule(reviseCapsule: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<any>(`${this.api.API_URL}/faculty/reviseCapsule`, reviseCapsule, { headers })
  }

}
