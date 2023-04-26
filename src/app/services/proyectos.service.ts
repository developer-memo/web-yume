import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Projects } from '../interfaces/proyectos.interface';

const BASE_URL = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  public httpOptions:any = {}; 

  constructor(
    private http: HttpClient,
  ) {
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };
    
  }


  //Método de servicio para obtener proyectos
  public getAllProjectsService = () =>{
    return this.http.get(`${BASE_URL}/allProyectos`, this.httpOptions).pipe( 
      tap( resp => resp ))
  }


  //Método de servicio para insertar proyectos
  public insertProjectService = (data:Object) =>{
    return this.http.post(`${BASE_URL}/insertProject`, data, this.httpOptions).pipe(
      tap( resp => resp )
    );
  }


  //Método de servicio para actualizar proyectos
  public updateProjectsService = (data:Projects) =>{
    return this.http.put(`${BASE_URL}/updateProject`, data, this.httpOptions).pipe( 
      tap( resp => resp ))
  }



  //Método de servicio para eliminar imagen del proyecto
  public deleteImageService = (imagen:string) =>{
    return this.http.delete(`${BASE_URL}/deleteImage/${imagen}`, this.httpOptions).pipe( tap( resp => resp ))
  }

  //Método de servicio para eliminar proyectos
  public deleteProjectsService = (id:string) =>{
    return this.http.delete(`${BASE_URL}/deleteProject/${id}`, this.httpOptions).pipe( 
      tap( resp => resp ))
  }

}
