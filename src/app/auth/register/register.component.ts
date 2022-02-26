import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;
  public completeInfo:boolean = false;

  public registerForm = this.fb.group({
    nombre: ['', [ Validators.required, Validators.minLength(6) ]],
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(8) ]],
    password2: ['', [ Validators.required, Validators.minLength(8) ]],
    terminos: [false, [ Validators.required ]],

  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( 
              private fb: FormBuilder,
              private usuarioSrv: UsuarioService,
              private router: Router
              ) { }

  ngOnInit(): void {
  }


  /**
   * Método para registrar un usuario
   */
  public crearUsuario = async() =>{
    this.formSubmitted = true;

    if ( this.registerForm.invalid ) {
      return; 
    }

    if ( this.registerForm.get('terminos').value ) {
      
      //Realizar la creación de usuario
      // await this.usuarioSrv.crearUsuarioServices( this.registerForm.value ).subscribe( resp =>{
        
      //   if ( resp.ok ) {
      //     this.usuarioSrv.crearInfoUsuarioService( resp.token ).subscribe( data => {
          
      //       if ( data['ok'] ) {
      //         this.usuarioSrv.getInfoUserService(resp.usuario.uid, resp.token).subscribe( data2 =>{
  
      //           this.completeInfo = data2.infoUserDB[0].usuario.completeInfo;
      //           if ( this.completeInfo ) {
      //             Swal.fire('Hola!', data2.infoUserDB[0].usuario.nombre, 'success');
                  
      //           } else {
      //             Swal.fire('Hola!', data2.infoUserDB[0].usuario.nombre+'. Por favor no olvides completar tu cuenta para poder utilizar por completo VelaPay.', 'success');
      //           }
                
      //           this.router.navigateByUrl('/');
      //         })
      //       } else {
      //         Swal.fire('Lo sentimos!', 'En este momento no puedes registrarte. Inténtalo más tarde.', 'warning');
      //         return;
      //       }
            
      //     });
      //   } else {
      //     Swal.fire('Lo sentimos!', 'En este momento no puedes registrarte. Inténtalo más tarde.', 'warning');
      //     return;
      //   }
        
      // }, ( err ) =>{
      //   Swal.fire('Error', err.error.msg, 'error');
      // });
    }

  }



  /**
   * Métodos para validar campos del form
   * @param campo => nombre del campo
   */
  public campoNoValido = (campo:string):boolean =>{
    if ( this.registerForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  public aceptaTerminos = () =>{
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }


  public contrasenasNoValidas = () =>{
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;

    } else if( pass1 == '' && this.formSubmitted ) {
      return true;

    } else if( pass1.length < 8 && this.formSubmitted ) {
      return true;

    } else {
      return false;
    }
  }


  public passwordsIguales(pass1Name:string, pass2Name:string){

    return ( formGroup: FormGroup ) =>{
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);

      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
  }




}
