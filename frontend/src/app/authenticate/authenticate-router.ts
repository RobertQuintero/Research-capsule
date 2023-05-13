import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { GuestGuard } from "./guest.guard";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";

export const routes: Routes=[
  {path: '', children: [
    { path: '' , component: LoginComponent, pathMatch: 'full'},
    { path: 'register', component: RegisterComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password/:token', component: PasswordResetComponent },
  ],
  canActivate: [GuestGuard]
},
];
