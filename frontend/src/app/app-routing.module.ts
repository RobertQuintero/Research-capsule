import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './shared/profile/profile.component';
import { UserResolver } from './user/user.resolver';
import { ErrorNotFoundComponent } from './errors/error-not-found/error-not-found.component';
import { ErrorUnauthorizedComponent } from './errors/error-unauthorized/error-unauthorized.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';

const routes: Routes = [
  {path: 'profile/change-password', component: ChangePasswordComponent,resolve: {userResolve: UserResolver}},
  {path: 'profile', component: ProfileComponent, resolve: {userResolve: UserResolver}},
  { path: '404', component: ErrorNotFoundComponent },
  { path: '401', component: ErrorUnauthorizedComponent },
  {path: '**', redirectTo: '404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
