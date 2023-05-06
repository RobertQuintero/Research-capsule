import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './authenticate-router';
import { ReactiveFormsModule } from '@angular/forms';
import { NbToastrModule } from '@nebular/theme';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NbToastrModule.forRoot(),
  ],

})
export class AuthenticateModule { }
