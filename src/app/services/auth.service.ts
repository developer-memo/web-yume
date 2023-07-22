import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';
import { User } from '../interfaces/user.interface';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public httpOptions:any = {};
  public usuario:User[] = [];

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
        this.usuario = resp.usuario.map((us:any) =>({
          id: us.id_us,
          nombre: us.nombre_us,
          email:    us.email_us,
          telefono: us.telefono_us,
          direccion: us.direccion_us,
          estado:   us.estado_us,
          genero:   us.genero_us,
          admin:    us.admin_us,
          fechareg: us.fechareg_us,
          avatar:   us.avatar_us
        }))
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true),
      catchError( err => of(false) )
    )
  }



  /**
   * Método de servicio para recuperar contraseña
   */
  public recoverPassService = (formData:any) =>{
    return this.http.post(`${BASE_URL}/resetEmail`, formData, this.httpOptions).pipe( tap( res => res));
  }



  /**
   * Método de servicio para actualizar contraseña
   */
  public newPassService = (formData:any) =>{
    return this.http.put(`${BASE_URL}/updatePassword`, formData, this.httpOptions).pipe( tap( res => res));
  }



  /**
   * Método de servicio para cerrar sesión
   */
  public logoutService = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('finanzas');
    localStorage.removeItem('Ingresado');
    localStorage.removeItem('projects');
    this.router.navigateByUrl('/login');
  }




}
