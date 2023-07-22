import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public completeInfo:boolean = false;
  public esperando:boolean = false;
  public loginForm:FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authServ: AuthService,
  ) { }

  ngOnInit(): void {
    //Iniciar formulario
    this.iniciarFormulario();
  }


  /**
   * Método para iniciar sesión
   */
  public login = () =>{
    this.formSubmitted = true;

    if ( this.loginForm.invalid ) {
      return;
    }

    this.esperando = true;
    this.authServ.loginService( this.loginForm.value ).subscribe( resp =>{

      this.guardaLocalStorage(this.loginForm.value);
      this.esperando = false;
      this.router.navigateByUrl('/');


    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
      setTimeout(() => { Swal.close(); }, 2000);
      this.esperando = false;
    })
  }



  /**
   * Método para validar los campos del form
   * @param campo => Valor del campo
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.loginForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }



  public iniciarFormulario = () =>{
    this.loginForm = this.fb.group({
      email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required, Validators.minLength(8) ]],
      remember: [false]
    });
  }



  /**
   * Método para guardar el localstorage
   * @param formData => Data del formulario login
   */
  public guardaLocalStorage = (formData:LoginForm) => {

    if ( formData.remember ) {
      localStorage.setItem('email', formData.email );
      localStorage.setItem('remember', JSON.stringify(formData.remember) );
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('remember');
    }
  }


}
