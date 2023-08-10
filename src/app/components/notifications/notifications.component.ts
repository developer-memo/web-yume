import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notifications } from 'src/app/interfaces/notifications.interface';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Subscription } from 'rxjs';
import { NotificationsType } from '../../models/notificaciones.model';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notifications: Notifications[] = [];
  notiSubcrip: Subscription;
  notificationsType: any = NotificationsType;
  usuario:User;

  constructor(
    public webSocketSrv: WebSocketService,
    private notificaSrv: NotificacionesService,
    private authServ: AuthService,
  ) { }

  async ngOnInit() {
    this.usuario = this.authServ.usuario[0];
    await this.getNotifications();

    this.listenNotificationsAdmin('new-notification');
    this.listenNotificationsAdmin('new-reminder');

  }

  ngOnDestroy(): void {
    this.notiSubcrip.unsubscribe();
  }


  async getNotifications() {
    await this.notificaSrv.getNotificationsService(this.usuario.id).then( (resp:any) =>{
      resp.notificaciones.forEach((item:any) => {
        let json = {
          id: item.id_noti,
          tipo: item.tipo_noti,
          idAdmin: item.id_admin,
          nombre: item.nombre_us,
          titulo: item.titulo_noti,
          desp: item.descrip_noti,
          fecha: item.fecha_noti
        }
        this.notifications.unshift(json);
        this.webSocketSrv.acountNoti = this.notifications.length;
      });
    }).catch( err => console.log(err));
  }


  delNotificationById(id:string) {
    this.notificaSrv.deleteNotificationsService(id, 'one').subscribe( resp =>{
      this.notifications = this.notifications.filter( noti => noti.id != id);
      this.webSocketSrv.acountNoti = this.notifications.length;
    }, err => console.error(err))
  }

  delAllNotifications() {
    this.notificaSrv.deleteNotificationsService(this.usuario.id, 'all').subscribe( resp =>{
      this.notifications = [];
      this.webSocketSrv.acountNoti = this.notifications.length;
    }, err => console.error(err))
  }


  listenNotificationsAdmin(event:string) {
    this.notiSubcrip = this.webSocketSrv.listenEvent(event).subscribe( (msg:any) =>{
      if (this.usuario.id == 1 && (msg.tipo == 'NEW_USER' || msg.tipo == 'PAY')) {
        this.notifications.unshift(msg);
        this.webSocketSrv.acountNoti = this.notifications.length;
      }
    });
  }

}
