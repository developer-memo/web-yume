import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public dataInfoUser:any[] = [];
  public token:string = '';
  public uid:string = '';
  public perfilForm: FormGroup;
  public imgSubir: File;

  constructor( 
              private fb: FormBuilder,
              private usuarioSrv: UsuarioService,
              private fileUploadSrv: FileUploadService ) { }

  ngOnInit(): void {

    this.token = localStorage.getItem('token');
    this.dataInfoUser = JSON.parse( localStorage.getItem('infoUsuario') );
    this.uid = this.dataInfoUser['infoUserDB'][0]['usuario']['_id'];
  
    this.perfilForm = this.fb.group({
      nombre: [this.dataInfoUser['infoUserDB'][0]['usuario']['nombre'], [Validators.required, Validators.minLength(6)]],
      email: [this.dataInfoUser['infoUserDB'][0]['usuario']['email'], [Validators.required, Validators.email]],
      role: ['USER_ROLE', Validators.required ],
    })

  }

  /**
   * Método para actualizar el perfil de usuario
   */
  public actualizarPerfil = () =>{
    
    
  }




  public cambiarImagen = (file:File) =>{
    console.log(file);
    this.imgSubir = file;
  }


  public subirAvatar = () =>{
    this.fileUploadSrv.actualizarAvatarServices(this.imgSubir, 'usuarios', this.uid).then( img =>{

      console.log(img);
     
    })
  }




}
