import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit, OnDestroy {

  private _unsubscribeAll:Subject<any> = new Subject<any>();

  public usuario:User;
  public formSubmitted = false;

  public formCrearCliente = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    telefono: ['', [Validators.required, Validators.minLength(5)]],
    genero: ['', [Validators.required]],
    password: [''],
  })

  constructor(
    private fb: FormBuilder,
    private clienteServ: UsuarioService,
    private router: Router,
    private authServ: AuthService,
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  /**
   * Método para crear clientes
   */
  public crearCliente = () =>{
    this.formSubmitted = true;
    if ( this.formCrearCliente.invalid ) { return; }

    this.clienteServ.crearUsuarioServices(this.formCrearCliente.value, this.usuario.id).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{

      Swal.fire('Bien!', 'cliente creado con éxito', 'success');
      setTimeout(() => { this.router.navigate(['dashboard/clientes/lista-clientes']); Swal.close(); }, 2000);

    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
    })
  }



  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formCrearCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


}
