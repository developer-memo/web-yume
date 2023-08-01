import { Component, ElementRef, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  mediaqueryList = window.matchMedia("(max-width: 768px)");
  dataInfoUser:User;
  btnMenu: HTMLElement;
  eventName: string = 'send-notification';

  constructor(
    private authSrv: AuthService,
    private sharedSrv: SharedService,
    private element: ElementRef<HTMLElement>
  ) { }


  ngOnInit(): void {
    this.dataInfoUser = this.authSrv.usuario[0];


    if(this.mediaqueryList.matches) {
      this.btnMenu = this.element.nativeElement.querySelector('#btn-menu-toggle');
      this.sharedSrv.sendHtmlService(this.btnMenu);
    }

    this.autoLogOut();
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


  public autoLogOut() {
    let count = 300;
    const interval = window.setInterval(() =>{
      document.onmousemove = function(){ count = 300 }
      count--;

      if(count == 1){
        this.authSrv.logoutService();
        clearInterval(interval);
      }
    }, 1000)
  }

}
