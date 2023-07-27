import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-crear-pagos',
  templateUrl: './crear-pagos.component.html',
  styleUrls: ['./crear-pagos.component.css']
})
export class CrearPagosComponent implements OnInit {

  public credito:any[] = [];
  public formSubmitted:boolean = false;
  public formCrearPagos:FormGroup;

  constructor(
      private routeActive: ActivatedRoute,
      private pagosServ: PagosService,
      private location: Location,
      private router: Router,
      private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.routeActive.params.subscribe( data =>{
      this.credito = JSON.parse( data['credito'] ) || [];

      console.log(this.credito)
    });

    this.cargarFormulario();
  }


  /**
   * Método para crear pagos
   */
  public crearPagos = () =>{
    this.formSubmitted = true;

    if ( this.formCrearPagos.invalid ) {
      return;
    }

    this.pagosServ.createPagosService(this.formCrearPagos.value, this.credito[0].id_cred, this.credito[0].id_us ).subscribe( (resp:any) =>{

      Swal.fire('Bien!', resp.msg, 'success');
      setTimeout(() => { this.router.navigate(['dashboard/detalle-credito', this.credito[0].id_us]); Swal.close(); }, 2000);
    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para cargar formulario
   */
  public cargarFormulario = () =>{
    this.formCrearPagos = this.fb.group({
      valor: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required]],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
    })
  }



  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formCrearPagos.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  goBack(){
    this.location.back();
  }


}
