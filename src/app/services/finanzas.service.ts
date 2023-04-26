import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  public httpOptions:any = {}; 

  constructor(
              private http: HttpClient,
  ) {

    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };
    
  }


  /**
   * Método de servicio para obtener el crédito por cliente
   * @param idUs => ID del cliente
   */
  public getFinanzasByIdService = (idUs:any) =>{
    return this.http.get(`${BASE_URL}/finanzas/${idUs}`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }



  /**
   * Método de servicio para obtener los ingresos por cliente
   * @param idUs => ID del cliente
   */
  public getIngresosByIdService = (idUs:any) =>{
    return this.http.get(`${BASE_URL}/ingresos/${idUs}`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }


  /**
   * Método de servicio para obtener ingreso por id
   */
  public getIngresoService = (id:string) =>{
    return this.http.get(`${BASE_URL}/ingreso/${id}`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }




  /**
   * Método de servicio para obtener los ingresos por cliente
   * @param idUs => ID del cliente
   */
  public getEgresosByIdService = (idUs:any) =>{
    return this.http.get(`${BASE_URL}/egresos/${idUs}`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }


  /**
   * Método de servicio para obtener egreso por id
   */
  public getEgresoService = (id:string) =>{
    return this.http.get(`${BASE_URL}/egreso/${id}`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }



  /**
   * Método de servicio para insertar ingresos
   * @param json => Objeto con el ingreso
   */
  public insertIngresosService = (json:any) =>{
    return this.http.post(`${BASE_URL}/insertIngreso`, json, this.httpOptions).pipe(
      tap( resp => resp )
    )
  }



  /**
   * Método de servicio para insertar egresos
   * @param json => Objeto con el egreso
   */
  public insertEgresosService = (json:any) =>{

    return this.http.post(`${BASE_URL}/insertEgreso`, json, this.httpOptions).pipe(
      tap( resp => resp )
    )

  }



  /**
   * Método de servicio para actualizar ingresos
   * @param formData => Datos del formulario
   */
  public updateIngresoService = (formData:any) =>{
    const json = {
      comentario: formData.comentario,
      fecha: formData.fecha,
      idIngreso: formData.id,
      valor: Number(formData.valor.slice(1,100).replaceAll(',', '')),
      pagoCredito: formData.pagoCredito == true? 1: 0,
      detalles: formData.detalles,
      tipo: formData.tipo,
    }
    return this.http.put(`${BASE_URL}/updateIngreso`, json, this.httpOptions).pipe(
      tap( resp => resp )
    )
  }


  /**
   * Método de servicio para actualizar egresos
   * @param formData => Datos del formulario
   */
  public updateEgresoService = (formData:any) =>{
    const json = {
      comentario: formData.comentario,
      fecha: formData.fecha,
      idEgreso: formData.id,
      valor: Number(formData.valor.slice(1,100).replaceAll(',', '')),
      prestamo: formData.prestamo == true? 1: 0,
      detalles: formData.detalles,
      tipo: formData.tipo,
    }
    return this.http.put(`${BASE_URL}/updateEgreso`, json, this.httpOptions).pipe(
      tap( resp => resp )
    )
  }


  /**
   * Método de servicio para eliminar ingresos
   * @param idIngreso => ID del ingreso a eliminar
   */
  public deleteIngresoService = (idIngreso:any) =>{
    
    return this.http.delete(`${BASE_URL}/deleteIngreso/${idIngreso}`, this.httpOptions).pipe(
      tap( resp => resp )
    )

  }


  /**
   * Método de servicio para eliminar egresos
   * @param idIngreso => ID del egreso a eliminar
   */
   public deleteEgresoService = (idEgreso:any) =>{
    
    return this.http.delete(`${BASE_URL}/deleteEgreso/${idEgreso}`, this.httpOptions).pipe(
      tap( resp => resp )
    )

  }


  /**
   * Método de servicio para consultar ingresos por fechas
   * @param formData => Datos con las fechas 
   */
  public filterFechasIngreService = (idUser:any, formData:any) =>{

    const json = {
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      idUs: idUser
    }

    return this.http.post(`${BASE_URL}/filterFechasIngre`, json, this.httpOptions).pipe(
      map( resp => resp )
    )
  }


  /**
   * Método de servicio para consultar egresos por fechas
   * @param formData => Datos con las fechas 
   */
   public filterFechasEgreService = (idUser:any, formData:any) =>{

    const json = {
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      idUs: idUser
    }

    return this.http.post(`${BASE_URL}/filterFechasEgre`, json, this.httpOptions).pipe(
      map( resp => resp )
    )
  }



}
