import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( ) { }


  /**
   * Método para actualizar el avatar del usuario
   * @param archivo => la nueva imagen
   * @param tipo => tipo de usuario
   * @param uid => ID del usuario
   */
  public actualizarAvatarServices = async( archivo:File, tipo:string, uid:string ) =>{
    try {
      const url = `${base_url}/upload/${tipo}/${uid}`;
      const formData = new FormData();
      formData.append('avatar', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token')
        },
        body: formData
      });

      const data = await resp.json();

      if ( data.ok ) {
        return data.nomArchivo;
      } else {
        console.log(data.msg);
        return false;
      }
      
    } catch (error) {
      console.log(error);
      return false;
    }
  }




}

