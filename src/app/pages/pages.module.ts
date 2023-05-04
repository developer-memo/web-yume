import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { DetallePagosComponent } from './detalle-pagos/detalle-pagos.component';
import { DetalleCuentaComponent } from './detalle-cuenta/detalle-cuenta.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { ListaPagosComponent } from './lista-pagos/lista-pagos.component';
import { CrearPagosComponent } from './crear-pagos/crear-pagos.component';
import { DetalleClientesComponent } from './detalle-clientes/detalle-clientes.component';
import { CrearCreditoComponent } from './crear-credito/crear-credito.component';
import { DetalleCreditoComponent } from './detalle-credito/detalle-credito.component';
import { ListaCreditosComponent } from './lista-creditos/lista-creditos.component';
import { DatosFinanzasComponent } from './datos-finanzas/datos-finanzas.component';
import { ListaIngresosComponent } from './ingresos/lista-ingresos/lista-ingresos.component';
import { ListaEgresosComponent } from './egresos/lista-egresos/lista-egresos.component';
import { CrearProyectosComponent } from './proyectos/crear-proyectos/crear-proyectos.component';
import { ListaProyectosComponent } from './proyectos/lista-proyectos/lista-proyectos.component';
import { DetalleIngresoComponent } from './ingresos/detalle-ingreso/detalle-ingreso.component';
import { DetalleEgresoComponent } from './egresos/detalle-egreso/detalle-egreso.component';
import { CrearIngresoComponent } from './ingresos/crear-ingreso/crear-ingreso.component';
import { CrearEgresoComponent } from './egresos/crear-egreso/crear-egreso.component';
import { EditarProyectoComponent } from './proyectos/editar-proyecto/editar-proyecto.component';
import { EditarIngresoComponent } from './ingresos/editar-ingreso/editar-ingreso.component';
import { EditarEgresoComponent } from './egresos/editar-egreso/editar-egreso.component';

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
    ListaEgresosComponent,
    CrearProyectosComponent,
    ListaProyectosComponent,
    DetalleIngresoComponent,
    DetalleEgresoComponent,
    CrearIngresoComponent,
    CrearEgresoComponent,
    EditarProyectoComponent,
    EditarIngresoComponent,
    EditarEgresoComponent
  ],
  exports: [DashboardComponent, PagesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PagesModule {}
