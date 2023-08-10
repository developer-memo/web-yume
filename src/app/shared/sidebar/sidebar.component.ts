import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  dataInfoUser:User;
  mediaqueryList = window.matchMedia("(max-width: 768px)");
  btnMenu: HTMLElement;

  constructor(
    private authSrv: AuthService,
    private sharedSrv: SharedService,
    public webSocketSrv: WebSocketService,
    ) { }

  ngOnInit(): void {
    this.dataInfoUser = this.authSrv.usuario[0];
    if(this.mediaqueryList.matches){
      this.sharedSrv.sendDomHtmlObservable.subscribe( (html:HTMLElement) =>{
        this.btnMenu = html;
      })
    }
  }

  ngAfterViewInit(): void {

  }


  /**
   * Event click menu mobile only
   */
  closeMenu = () =>{
    if(this.mediaqueryList.matches) {
      this.btnMenu.click()
    }
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
