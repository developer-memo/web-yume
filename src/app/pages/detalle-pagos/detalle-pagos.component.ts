import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-detalle-pagos',
  templateUrl: './detalle-pagos.component.html',
  styleUrls: ['./detalle-pagos.component.css']
})
export class DetallePagosComponent implements OnInit {

  public pago:any[] = [];
  public formEditPago:FormGroup;
  public formSubmitted = false;

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private router: Router,
              private fb: FormBuilder,
              private pagosServ: PagosService,
  ) { }

  ngOnInit(): void {
    this.routeActive.params.subscribe( data =>{
      this.pago = JSON.parse( data['pago'] ) || [];
      console.log(this.pago)
    });

    this.cargarFormulario();
  }




  /**
   * Método para actualizar pagos
   */
  public editarPagos = () =>{
    this.formSubmitted = true;
    
    if ( this.formEditPago.invalid ) {
      return;
    }

    this.pagosServ.updatePagosService(this.formEditPago.value, this.pago['id_pag']).subscribe( (resp:any) =>{

      Swal.fire('Bien!', resp.msg, 'success');
      setTimeout(() => { this.router.navigate(['dashboard/detalle-credito', this.pago['id_us']]); Swal.close(); }, 2000);

    }, (err) =>{
      Swal.fire('Error', err.msg, 'error');
    })

  }



  /**
   * Método para cargar el formulario
   */
  public cargarEditFormulario = () =>{
    const fecha = this.pago['fecha_pag'].split('T');
    this.formEditPago = this.fb.group({
      valor: [this.pago['valor_pag'], [Validators.required, Validators.minLength(4)]],
      fecha: [fecha[0], [Validators.required, Validators.minLength(5)]],
      comentario: [this.pago['comentario_pag'], [Validators.required, Validators.minLength(5)]],
      estado: [this.pago['estado_pag'] == 1? true : false, [Validators.required]],
    })
  }


  /**
   * Método para cargar el formulario
   */
  public cargarFormulario = () =>{
    this.formEditPago = this.fb.group({
      valor: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required]],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      estado: ['', [Validators.required]],
    })
  }


  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formEditPago.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  goBack(){
    this.location.back();
  }


}
