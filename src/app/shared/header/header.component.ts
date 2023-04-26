import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
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

  public dataInfoUser:User;
  

  constructor( private authSrv: AuthService ) { }


  ngOnInit(): void {
    this.dataInfoUser = this.authSrv.usuario[0];
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
        setTimeout(() => { this.authSrv.logoutService(); Swal.close(); }, 1000);
      }
    });
  }

}
