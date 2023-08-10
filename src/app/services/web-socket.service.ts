import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socketStatus: boolean = false;
  acountNoti:number;

  constructor(
    private socket: Socket
  ) {
    this.checkStatus();
  }


  checkStatus() {
    this.socket.on('connect', () =>{
      console.log('conectado al servidor');
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () =>{
      console.log('desconectado del servidor');
      this.socketStatus = false;
    });
  }


  emitEvent(event:string, payload?:any, callback?:Function ) {
    this.socket.emit(event, payload, callback);
  }

  listenEvent(event:string) {
    return this.socket.fromEvent(event);
  }

  getEventPrivate(event:string) {
    return this.socket.fromEvent(event);
  }


}
