import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CapsuleListComponent } from './capsule-list/capsule-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    CapsuleListComponent,
  ],
  imports: [
    SharedModule,
    MatFormFieldModule
  ],
  exports: [
    CapsuleListComponent
  ]
})
export class CapsuleModule { }
