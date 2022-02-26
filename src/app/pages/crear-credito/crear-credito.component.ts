import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { CreditosService } from 'src/app/services/creditos.service';

@Component({
  selector: 'app-crear-credito',
  templateUrl: './crear-credito.component.html',
  styleUrls: ['./crear-credito.component.css']
})
export class CrearCreditoComponent implements OnInit {

  public formSubmitted:boolean = false;
  public creditoActivo:boolean = false;
  public idCliente:string;
  public formCrearCredito:FormGroup;

  constructor( 
              private routeActive: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private location: Location,
              private creditoServ: CreditosService,
  ) { }

  ngOnInit(): void {
    this.routeActive.params.subscribe( data => {
      this.idCliente = JSON.parse( data['idUs'] ) || [];

      this.getCreditoById(this.idCliente)
    });

    this.cargarFormulario();

  }


  /**
   * Método para obtener el credito por cliente
   * @param idCliente => ID del cliente
   */
  public getCreditoById = (idCliente:any) => {
    this.creditoServ.getCreditoByIdService(idCliente).subscribe( (resp:any) =>{

      if( resp.credito[0].estado_cred ){
        Swal.fire('Crédito activo', 'No se puede crear créditos para este cliente.', 'error');
        setTimeout(() => { Swal.close(); }, 2000);
        this.creditoActivo = true;

      }else{
        this.creditoActivo = false;
        return;
      }

    })
  }




 /**
  * Método para crear créditos
  */
  public crearCredito = () =>{
    this.formSubmitted = true;

    if( this.formCrearCredito.invalid ){
      return;
    }

    console.log(this.formCrearCredito.value)
    this.creditoServ.createCreditoService( this.formCrearCredito.value, this.idCliente ).subscribe( (resp:any) =>{

      Swal.fire('Bien!', resp.msg, 'success');
      //setTimeout(() => { window.location.reload(); }, 2000);
      setTimeout(() => { this.router.navigate(['dashboard/lista-creditos']); Swal.close(); }, 2000);

    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
    })

  }




  /**
   * Método para cargar el formulario
   */
  public cargarFormulario = () =>{
    this.formCrearCredito = this.fb.group({
      monto: ['', [Validators.required, Validators.minLength(4)]],
      fecha: ['', [Validators.required]],
      plazo: ['', [Validators.required, Validators.minLength(5)]],
      valorcuota: ['', [Validators.required, Validators.minLength(4)]],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
    })
  }



  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formCrearCredito.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  goBack(){
    this.location.back();
  }



}
