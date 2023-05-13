import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class ResearchGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticateService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.getUserLevel().pipe(
        map((user: any) => {
          if (user.level == 1) {
            return true;
          }
          // Redirect to login not faculty
          this.router.navigate(['/401']);
          return false;
        })
      );
  }

}
