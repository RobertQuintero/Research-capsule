import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from '../environment/environment.service';
import { Observable } from 'rxjs';
import { IUser2, IUser, IUserRegister } from '../user/iuser';
import { ICapsule } from '../capsule/icapsule';
import { IReview } from '../faculty/ireview';

interface IDashboard {
  capsules: ICapsule[]
  reviews: IReview[]
  users: IUser2[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private api: EnvironmentService) { }

  getToken() {
    let token = localStorage.getItem('access_token')
    let atoken = token?.replace(/"/g, '');
    return atoken
  }

  editFaculty(facultyObject: IUser): Observable<IUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<IUser[]>(`${this.api.API_URL}/admin/updateFaculty`, facultyObject, {headers})
  }

  destroyFaculty(id: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.delete<IUser[]>(`${this.api.API_URL}/admin/destroyFaculty/${id}`, {headers})
  }

  getDashboardData(): Observable<IDashboard> {
    const headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<IDashboard>(`${this.api.API_URL}/admin/dashboardData`, {headers})
  }
}
