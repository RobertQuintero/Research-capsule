import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SubmittedResearchComponent } from './submitted-research/submitted-research.component';
import { RouterModule } from '@angular/router';
import { routes } from './faculty-router';
import { AssignedResearchComponent } from './assigned-research/assigned-research.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CapsuleModule } from '../capsule/capsule.module';



@NgModule({
  declarations: [
    SubmittedResearchComponent,
    AssignedResearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
  exports: [
    MatPaginatorModule,
    MatMenuModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CapsuleModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
})
export class FacultyModule { }
