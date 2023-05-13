import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticateService } from 'src/app/authenticate/authenticate.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  level!: number | null;

  subscription!: Subscription;
  currentRoute: string = '';
  authenticated!: boolean;
  isNavOpen = false;

  constructor(private _router: Router, private _auth: AuthenticateService) { }


  ngOnInit(): void {
    this.getLevel();
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  isAuthenticated(): boolean {
    return this._auth.isAuthenticated();
  }

  getLevel() {
    this.subscription = this._auth.getUserLevel().subscribe(
      (data: any) => {
        this.level = data.level
      },
      (err) => {
        console.log(err)
      }
    );

  }

  logout() {
    localStorage.removeItem('access_token');
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
