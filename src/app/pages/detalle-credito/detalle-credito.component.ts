import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { CreditosService } from 'src/app/services/creditos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-detalle-credito',
  templateUrl: './detalle-credito.component.html',
  styleUrls: ['./detalle-credito.component.css']
})
export class DetalleCreditoComponent implements OnInit {

  public idCliente:string;
  public creditoActivo = false;
  public credito:any[] = [];
  public pagos:any[] = [];
  public formEditCredito:FormGroup;
  public formSubmitted = false;
  public totalPagado:number = 0; 

  constructor(
              private routeActive: ActivatedRoute,
              private creditoServ: CreditosService,
              private pagosServ: PagosService,
              private location: Location,
              private router: Router,
              private fb: FormBuilder,
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

      this.credito = resp.credito || [];

      this.getPagosById(this.credito[0].id_cred);

    }, (err) =>{
      Swal.fire('Advertencia', 'No hay créditos para este cliente.', 'warning');
      setTimeout(() => { Swal.close(); }, 2000);
      this.creditoActivo = true;
    })
  }


  /**
   * Método para editar crédito
   */
  public editarCredito = () =>{
    this.formSubmitted = true;

    if ( this.formEditCredito.invalid ) {
      return;
    }

    this.creditoServ.updateCreditoService(this.formEditCredito.value, this.credito[0].id_cred).subscribe( (resp:any) =>{

      Swal.fire('Bien!', resp.msg, 'success');
      setTimeout(() => { window.location.reload(); Swal.close(); }, 2000);

    }, (err) =>{
      Swal.fire('Error', err.msg, 'error');
    })

  }


  /**
   * Método para obtener todos los pagos por ID crédito
   * @param idCredito => ID del crédito
   */
  public getPagosById = (idCredito:any) =>{

    this.pagosServ.getPagosByIdService(idCredito).subscribe( (resp:any) =>{

      this.pagos = resp.pagos || [];

      this.pagos.forEach( pag =>{
        this.totalPagado += pag.valor_pag;
      })

    }, (err) =>{
      console.log(err);
    })

  }



  /**
   * Método para cargar el formulario
   */
  public cargarEditFormulario = () =>{
    this.formEditCredito = this.fb.group({
      monto: [this.credito[0].monto_cred, [Validators.required, Validators.minLength(4)]],
      plazo: [this.credito[0].plazo_cred, [Validators.required, Validators.minLength(5)]],
      valorcuota: [this.credito[0].valorcuota_cred, [Validators.required, Validators.minLength(4)]],
      comentario: [this.credito[0].comentario_cred, [Validators.required, Validators.minLength(5)]],
      estado: [this.credito[0].estado_cred == 1? true : false, [Validators.required]],
    })
  }




  /**
   * Método para cargar el formulario
   */
  public cargarFormulario = () =>{
    this.formEditCredito = this.fb.group({
      monto: ['', [Validators.required, Validators.minLength(4)]],
      plazo: ['', [Validators.required, Validators.minLength(5)]],
      valorcuota: ['', [Validators.required, Validators.minLength(4)]],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      estado: ['', [Validators.required]],
    })
  }


  /**
   * Método para navegar a crear pagos
   * @param credito => Objeto del crédito
   */
  public navegarCrearPago = (credito:any) =>{
    const ObjCredito = JSON.stringify(credito);
    this.router.navigate(['dashboard/crear-pagos', ObjCredito]);

  }


  /**
   * Método para navegar a detalle pago
   * @param pago => Objeto del pago
   */
  public navegarVerPagos = (pago:any) =>{
    const ObjPago = JSON.stringify(pago);
    this.router.navigate(['dashboard/detalle-pagos', ObjPago]);

  }




  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formEditCredito.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }




  goBack(){
    this.location.back();
  }



}
