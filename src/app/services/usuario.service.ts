import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ClienteForm } from '../interfaces/cliente.form.interface';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public httpOptions:any = {};
  public httpOptions2:any = {};
  public timeElapsed = Date.now();
  public today = new Date(this.timeElapsed);
  public usuario:any[] = [];

  constructor(
              private http: HttpClient,
              private router: Router
               ) {
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };
    this.httpOptions2 = { headers: new HttpHeaders({ 'Content-Type':  'application/json'}) };
   }


  /**
   * Método de servicio para crear usuarios
   * @param formData => Información del formulario
   */
  public crearUsuarioServices = ( formData: ClienteForm, useAdmin:number|string ) =>{
    const json = {
      nombre: formData.nombre,
      email: formData.email,
      password: '%$(/(=!&#)&%@#',
      telefono: formData.telefono,
      direccion: formData.direccion,
      genero: formData.genero,
      useadmin: useAdmin
    }
    return this.http.post(`${BASE_URL}/insertUsuario`, json, this.httpOptions).pipe(
      tap( (resp: any) => {})
    );
  }


  public registrarUsuarioServices = async( formData: ClienteForm ) =>{
    const json = {
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      direccion: formData.direccion,
      genero: formData.genero
    }
    return await this.http.post<any>(`${BASE_URL}/registerUsuario`, json, this.httpOptions2).toPromise();

  }



  /**
   * Método de servicio para obtener todo los clientes
   */
  public getClientesService = (user:number|string) =>{
    return this.http.get(`${BASE_URL}/usuarios/${user}`, this.httpOptions).pipe(
      map( resp => resp)
    )
  }


  /**
   * Método de servicio para obtener todo los clientes
   */
  public getClienteByIdService = (id:number) =>{
    return this.http.get(`${BASE_URL}/usuario/${id}`, this.httpOptions).pipe(
      map( (resp:any) => ({
          id:        resp.usuario[0].id_us,
          nombre:    resp.usuario[0].nombre_us,
          email:     resp.usuario[0].email_us,
          telefono:  resp.usuario[0].telefono_us,
          direccion: resp.usuario[0].direccion_us,
          estado:    resp.usuario[0].estado_us,
          genero:    resp.usuario[0].genero_us,
          admin:     resp.usuario[0].admin_us,
          fechareg:  resp.usuario[0].fechareg_us,
          avatar:    resp.usuario[0].avatar_us
      }))
    )
  }


  /**
   * Método de servicio para actualizar el cliente
   * @param formData => Datos del formulario
   * @param idUs => ID del cliente a actualizar
   */
  public updateClienteService = (formData:ClienteForm, idUs:any) =>{
    const json = {
      idUs,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      estado: formData.estado == true? 1 : 0
    }
    return this.http.put(`${BASE_URL}/updateCliente`, json, this.httpOptions ).pipe(
      tap( resp => resp )
    )
  }


  /**
   * Método de servicio para actualizar el usuario
   */
  public updateUserService = (formData:Object) =>{
    return this.http.put(`${BASE_URL}/updateUser`, formData, this.httpOptions ).pipe(
      tap( resp => resp )
    )
  }



}
