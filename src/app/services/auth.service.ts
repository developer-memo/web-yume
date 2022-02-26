import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public httpOptions:any = {}; 
  public usuario:any[] = [];


  constructor(
              private http: HttpClient,
              private router: Router
  ) { 
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json'}) };
  }



  /**
   * Método de servicio para login de usuario
   * @param formData => Datos del formulario
   */
  public loginService = (formData:LoginForm) =>{

    return this.http.post(`${BASE_URL}/loginUser`, formData, this.httpOptions).pipe(
      map( resp => resp ),
      tap( (resp:any) =>{
        localStorage.setItem('token', resp.token);
        localStorage.setItem('Ingresado', 'Si');
      })
    )

  }




  /**
   * Método de servicio para validar el token de seguridad
   */
  public validaTokenService = ():Observable<boolean> =>{

    const header = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };

    return this.http.get(`${BASE_URL}/loginrenew`, header).pipe(
      tap( (resp:any) =>{
        this.usuario = resp.usuario;
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true),
      catchError( err => of(false) )
    )

  }



  /**
   * Método de servicio para cerrar sesión
   */
  public logoutService = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('finanzas');
    localStorage.removeItem('Ingresado');
    this.router.navigateByUrl('/login');
  }




}
