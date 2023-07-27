import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit, OnDestroy {

  private _unsubscribeAll:Subject<any> = new Subject<any>();

  public usuario:User;
  public clientes:User;

  constructor(
    private clientesServ: UsuarioService,
    private router: Router,
    private authServ: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];
    this.getAllClientes();
  }


  /**
   * Método para obtener los clientes
   */
  public getAllClientes = () =>{
    this.clientesServ.getClientesService(this.usuario.id).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.clientes = resp.usuarios.map((us:any) =>({
        id:        us.id_us,
        nombre:    us.nombre_us,
        email:     us.email_us,
        telefono:  us.telefono_us,
        direccion: us.direccion_us,
        estado:    us.estado_us,
        genero:    us.genero_us,
        admin:     us.admin_us,
        fechareg:  us.fechareg_us,
        avatar:    us.avatar_us
      }));
    }, (err) =>{
      Swal.fire('Error', 'En este momento no es posible cargar los clientes. Inténtelo más tarde.', 'error');
      console.log(err);
      setTimeout(() => { Swal.close(); }, 2000);
    })
  }


  /**
   * Método para navegar a detalle cliente
   * @param cliente => Objeto con datos del cliente
   */
  public navegarDetalleCliente = (id:number) =>{
    this.router.navigate(['dashboard/clientes/detalle-clientes', id]);
  }


}
