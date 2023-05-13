import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, DatePipe } from '@angular/common';
import { FacultyModule } from './faculty/faculty.module';
import { ErrorNotFoundComponent } from './errors/error-not-found/error-not-found.component';
import { ErrorUnauthorizedComponent } from './errors/error-unauthorized/error-unauthorized.component';
import { CoreModule } from './core/core.module';


@NgModule({
  declarations: [
    AppComponent,
    ErrorNotFoundComponent,
    ErrorUnauthorizedComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    AuthenticateModule,
    BrowserAnimationsModule,
    AdminModule,
    MatSidenavModule,
    FacultyModule,
    AppRoutingModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
