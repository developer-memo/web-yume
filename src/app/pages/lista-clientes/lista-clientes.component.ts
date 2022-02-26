import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  public clientes:any[] = [];

  constructor(
              private clientesServ: UsuarioService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllClientes();
  }


  /**
   * Método para obtener los clientes
   */
  public getAllClientes = () =>{
    this.clientesServ.getClientesService().subscribe( (resp:any) =>{
      this.clientes = resp.usuarios || [];
      
    }, (err) =>{
      Swal.fire('Error', 'En este momento no es posible cargar los clientes. Inténtelo más tarde.', 'error');
    })
  }


  /**
   * Método para navegar a detalle cliente
   * @param cliente => Objeto con datos del cliente
   */
  public navegarDetalleCliente = (cliente:any) =>{
    const ObjCliente = JSON.stringify(cliente);
    this.router.navigate(['dashboard/detalle-clientes', ObjCliente]);

  }
  

}
