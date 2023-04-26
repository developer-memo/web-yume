import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule 
  ]
})
export class MaterialModule { }
