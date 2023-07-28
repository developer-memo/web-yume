import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { User } from 'src/app/interfaces/user.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detalle-clientes',
  templateUrl: './detalle-clientes.component.html',
  styleUrls: ['./detalle-clientes.component.css']
})
export class DetalleClientesComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private debounceTimer?: NodeJS.Timeout;

  public idUs:number;
  public cliente:User;
  public usuario:User;
  public formEditCliente:FormGroup;
  public formSubmitted = false;
  public checkboxValue:boolean = false;

  constructor(
    private routeActive: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private clienteServ: UsuarioService,
    private toastrSvc: ToastrService,
    private authServ: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];
    this.routeActive.params.subscribe( data => {
      this.idUs = JSON.parse( data['idUs'] );
    });
    this.iniciarFormulario();
    this.getClienteById();
  }


  /**
   * Método para obtener usuario por id
   */
  public getClienteById = () =>{
    const clienteSrv$ = this.clienteServ.getClienteByIdService(this.idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.cliente = resp || [];
      (this.cliente.permiso == 'Y') ? this.checkboxValue = true : this.checkboxValue = false;
    }, err =>{
      console.log(err);
      clienteSrv$.unsubscribe();
      this.toastrSvc.error(`${err.error.msg}..`, 'Uppsss!');
      setTimeout(() => { this.location.back(); }, 1500);
    })
  }

  /**
   * Método para actualizar los clientes
   */
  public actualizarCliente = () =>{
    this.formSubmitted = true;

    if ( this.formEditCliente.invalid ) {
      return;
    }
    this.clienteServ.updateClienteService(this.formEditCliente.value, this.cliente.id).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      Swal.fire('Bien!', resp.msg, 'success');
      setTimeout(() => { this.router.navigate(['dashboard/clientes/lista-clientes']); Swal.close(); }, 2000);
    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
    })
  }


  /**
   * Método para cargar el formulario
   * @param cliente => Objeto del cliente
   */
  public cargarEditFormulario = (cliente:any) =>{
    this.formEditCliente = this.fb.group({
      nombre: [cliente.nombre, [Validators.required, Validators.minLength(5)]],
      email: [cliente.email, [Validators.required, Validators.email, Validators.minLength(6)]],
      direccion: [cliente.direccion, [Validators.required, Validators.minLength(5)]],
      telefono: [cliente.telefono, [Validators.required, Validators.minLength(5)]],
      genero: [cliente.genero, [Validators.required]],
      estado: [cliente.estado == 1? true : false, [Validators.required]],
    })
  }


  /**
   * Método para navegar a crear crédito
   * @param idUs => ID del cliente
   */
  public navegarCrearCredito = (idUs:any) =>{
    this.router.navigate(['dashboard/creditos/crear-credito', idUs]);
  }


  /**
   * Método para navegar a ver crédito
   * @param idUs => ID del cliente
   */
  public navegarVerCredito = (idUs:any) =>{
    this.router.navigate(['dashboard/creditos/detalle-credito', idUs]);
  }



  /**
   * Método para iniciar el formulario
   */
  public iniciarFormulario = () =>{
    this.formEditCliente = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.minLength(5)]],
      genero: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    })
  }



   switchAcceso(value:boolean) {
    if(this.debounceTimer) clearTimeout(this.debounceTimer);
    let opt = '';
    let msg = '';
    (value)? opt = 'Y' : opt = 'N';
    if(value) msg = `Se envio un correo electrónico a ${this.cliente.nombre} para que pueda ingresar a YUME.`;
    const json = {
      permiso: opt,
      id: this.idUs
    }
    this.debounceTimer = setTimeout( async() => {
      await this.clienteServ.updateAccesoService(json).then( (resp:any) =>{
        this.toastrSvc.success(`${resp.msg} ${msg}`, 'Bien hecho!');

      }).catch( err =>{
        console.log(err);
        this.toastrSvc.error(`${err.error.msg}..`, 'Uppsss!');
      })

      if( value ) await this.clienteServ.sendEmailNewUserService(this.cliente, 'accesoUserEmail');
    }, 1500);
  }


  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formEditCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  goBack(){
    this.location.back();
  }


}
