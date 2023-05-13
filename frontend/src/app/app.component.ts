import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from './authenticate/authenticate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  level!: number;


  constructor(private _router: Router, private _auth: AuthenticateService){}


  authenticated():boolean {
    return this._auth.isAuthenticated();
  }

  getLevel() {
    if(this.authenticated()){
      this._auth.getUserLevel().subscribe(
        (data: any) => {
          this.level = data.level
        },
        (err) => {
          console.log(err)
        }
      );
      return true;
    }
    return false;
  }

  logout(){
    localStorage.removeItem('access_token');
    this._router.navigate(['/']);
  }

}
