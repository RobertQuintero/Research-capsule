import { NgModule } from '@angular/core';
import { routes } from './admin-routing.module';
import { NewFacultyComponent } from './new-faculty/new-faculty.component'
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RegisteredFacultyComponent } from './registered-faculty/registered-faculty.component';
import { CapsuleModule } from '../capsule/capsule.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    NewFacultyComponent,
    RegisteredFacultyComponent,
    DashboardComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    CapsuleModule,
  ],
})
export class AdminModule { }
