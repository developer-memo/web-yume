import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public dataInfoUser:User;
  public token:string = '';
  public uid:number;
  public perfilForm: FormGroup;
  public imgUpload: File;

  constructor(
      private fb: FormBuilder,
      private projectsSrv: ProyectosService,
      private fileUploadSrv: FileUploadService,
      private element: ElementRef<HTMLElement>,
      private authSrv: AuthService,
      private usuarioSrv: UsuarioService,
      private toastrSvc: ToastrService,
      private spinnerSrv: SpinnerService,
      private router: Router,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.dataInfoUser = this.authSrv.usuario[0];

    this.perfilForm = this.fb.group({
      id: [this.dataInfoUser.id],
      nombre: [this.dataInfoUser.nombre, [Validators.required, Validators.minLength(6)]],
      email: [this.dataInfoUser.email, [Validators.required, Validators.email]],
      direccion: [this.dataInfoUser.direccion, [Validators.required, Validators.minLength(6)]],
      telefono: [this.dataInfoUser.telefono, [Validators.required, Validators.minLength(6)]],
      imagenTmp: [''],
      avatar: [this.dataInfoUser.avatar],
    })
  }

  /**
   * Método para actualizar el perfil de usuario
   */
  public actualizarPerfil = async() =>{
    this.spinnerSrv.show()
    if (this.perfilForm.get('imagenTmp').value) {
      this.projectsSrv.deleteImageService(this.perfilForm.get('avatar').value).pipe(takeUntil(this._unsubscribeAll)).subscribe(resp=>{}, err =>{ console.log(err)});

      await this.fileUploadSrv.uploadImageServices(this.imgUpload).then(resp =>{
        this.perfilForm.patchValue({['avatar']: resp.nombreImg });
      }).catch( err => console.log(err));
    }

    this.usuarioSrv.updateUserService(this.perfilForm.value).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.toastrSvc.success(`${resp.msg}`, 'Bien!');
      this.spinnerSrv.hide()
      setTimeout(() => { window.location.reload(); }, 1500);
    }, err =>{
      console.log(err);
      this.spinnerSrv.hide()
      this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
    })


  }




  public cambiarImagen = (file:File) =>{
    let imgTmp = this.element.nativeElement.querySelector('.img-tmp img');
    imgTmp.setAttribute('src', URL.createObjectURL(file))
    this.imgUpload = file;
  }




}
