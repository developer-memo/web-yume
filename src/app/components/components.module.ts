import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';

import { Grafica1Component } from './grafica1/grafica1.component';
import { Grafica2Component } from './grafica2/grafica2.component';
import { NotificationsComponent } from './notifications/notifications.component';



@NgModule({
  declarations: [
    Grafica1Component,
    Grafica2Component,
    NotificationsComponent
  ],
  exports: [
    Grafica1Component,
    Grafica2Component,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
