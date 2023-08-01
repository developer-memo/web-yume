import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notifications } from '../interfaces/notifications.interface';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  public httpOptions:any = {};

  constructor(
    private http: HttpClient,
  ) {
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };
  }


  getNotificationsService = async(id:number | string) =>{
    return await this.http.get<Notifications>(`${BASE_URL}/notificaciones/${id}`, this.httpOptions).toPromise();
  }


  deleteNotificationsService = (id:string | number, opt:string) =>{
    return this.http.delete(`${BASE_URL}/deleteNotification/${id}/${opt}`, this.httpOptions);
  }
}
