import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { DetallePagosComponent } from './detalle-pagos/detalle-pagos.component';
import { DetalleCuentaComponent } from './detalle-cuenta/detalle-cuenta.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { ListaPagosComponent } from './lista-pagos/lista-pagos.component';
import { CrearPagosComponent } from './crear-pagos/crear-pagos.component';
import { DetalleClientesComponent } from './detalle-clientes/detalle-clientes.component';
import { CrearCreditoComponent } from './crear-credito/crear-credito.component';
import { DetalleCreditoComponent } from './detalle-credito/detalle-credito.component';
import { ListaCreditosComponent } from './lista-creditos/lista-creditos.component';
import { DatosFinanzasComponent } from './datos-finanzas/datos-finanzas.component';
import { ListaIngresosComponent } from './lista-ingresos/lista-ingresos.component';
import { ListaEgresosComponent } from './lista-egresos/lista-egresos.component';



@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    DetallePagosComponent,
    DetalleCuentaComponent,
    PerfilComponent,
    ListaClientesComponent,
    CrearClienteComponent,
    ListaPagosComponent,
    CrearPagosComponent,
    DetalleClientesComponent,
    CrearCreditoComponent,
    DetalleCreditoComponent,
    ListaCreditosComponent,
    DatosFinanzasComponent,
    ListaIngresosComponent,
    ListaEgresosComponent
  ],
  exports: [
    DashboardComponent,
    PagesComponent
  ],
  imports: [ 
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class PagesModule { }
