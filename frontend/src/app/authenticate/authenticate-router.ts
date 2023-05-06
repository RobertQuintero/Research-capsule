import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { GuestGuard } from "./guest.guard";

export const routes: Routes=[
  {path: '', children: [
    { path: '' , component: LoginComponent, pathMatch: 'full'},
    { path: 'register', component: RegisterComponent}
  ],
  canActivate: [GuestGuard]
},
];
