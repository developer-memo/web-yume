import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public dataInfoUser:any[] = [];
  

  constructor( private authSrv: AuthService ) { }


  ngOnInit(): void {
    this.dataInfoUser = this.authSrv.usuario;
  }


  /**
   * Método para cerrar sesión
   */
  public cerrarSesion = () =>{
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar sesión!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Sesión Cerrada!','Te esperamos pronto.','success');
        setTimeout(() => { this.authSrv.logoutService(); }, 1000);
      }
    });
  }

}
