import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetallePagosComponent } from './detalle-pagos/detalle-pagos.component';
import { DetalleCuentaComponent } from './detalle-cuenta/detalle-cuenta.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { ListaPagosComponent } from './lista-pagos/lista-pagos.component';
import { CrearPagosComponent } from './crear-pagos/crear-pagos.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { DetalleClientesComponent } from './detalle-clientes/detalle-clientes.component';
import { CrearCreditoComponent } from './crear-credito/crear-credito.component';
import { ListaCreditosComponent } from './lista-creditos/lista-creditos.component';
import { DetalleCreditoComponent } from './detalle-credito/detalle-credito.component';
import { DatosFinanzasComponent } from './datos-finanzas/datos-finanzas.component';
import { ListaIngresosComponent } from './lista-ingresos/lista-ingresos.component';
import { ListaEgresosComponent } from './lista-egresos/lista-egresos.component';


const routes: Routes = [
  {
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
      { path: 'detalle-pagos/:pago', component: DetallePagosComponent, data: {titulo: 'Detalle Pagos'} },
      { path: 'detalle-cuenta', component: DetalleCuentaComponent, data: {titulo: 'Detalle Cuenta'} },
      { path: 'detalle-clientes/:cliente', component: DetalleClientesComponent, data: {titulo: 'Detalle clientes'} },
      { path: 'detalle-credito/:idUs', component: DetalleCreditoComponent, data: {titulo: 'Detalle crédito'} },
      { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de Usuario'} },
      { path: 'datos-finanzas', component: DatosFinanzasComponent, data: {titulo: 'Datos Finanzas'} },
      { path: 'lista-clientes', component: ListaClientesComponent, data: {titulo: 'Lista de clientes'} },
      { path: 'lista-pagos', component: ListaPagosComponent, data: {titulo: 'Lista de pagos'} },
      { path: 'lista-creditos', component: ListaCreditosComponent, data: {titulo: 'Lista de créditos'} },
      { path: 'lista-ingresos', component: ListaIngresosComponent, data: {titulo: 'Lista de ingresos'} },
      { path: 'lista-egresos', component: ListaEgresosComponent, data: {titulo: 'Lista de egresos'} },
      { path: 'crear-cliente', component: CrearClienteComponent, data: {titulo: 'Crear cliente'} },
      { path: 'crear-pagos/:credito', component: CrearPagosComponent, data: {titulo: 'Crear pagos'} },
      { path: 'crear-credito/:idUs', component: CrearCreditoComponent, data: {titulo: 'Crear crédito'} },
    ]
  },
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
