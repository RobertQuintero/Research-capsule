import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from '../shared/profile/profile.component'
import {NewFacultyComponent} from './new-faculty/new-faculty.component'
import { CapsuleListComponent } from '../capsule/capsule-list/capsule-list.component';
import { RegisteredFacultyComponent } from './registered-faculty/registered-faculty.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../authenticate/auth.guard';
import { AdminGuard } from '../authenticate/admin.guard';

export const routes: Routes = [
    {path: 'admin', children: [
        {path: 'new-faculty', component: NewFacultyComponent},
        {path: 'capsule', component: CapsuleListComponent},
        {path: 'registered-faculty', component: RegisteredFacultyComponent},
        {path: 'dashboard', component: DashboardComponent}
    ],
    canActivate: [AuthGuard, AdminGuard]
  }
];

