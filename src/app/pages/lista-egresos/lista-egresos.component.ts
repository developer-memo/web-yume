import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FinanzasService } from 'src/app/services/finanzas.service';

@Component({
  selector: 'app-lista-egresos',
  templateUrl: './lista-egresos.component.html',
  styleUrls: ['./lista-egresos.component.css']
})
export class ListaEgresosComponent implements OnInit {

  public finanza:any[] = [];
  public egresos:any[] = [];
  public formCrearEgreso:FormGroup;
  public formEditarEgreso:FormGroup;
  public formFiltroFechas:FormGroup;
  public formSubmitted:boolean = false;
  public idUsuario:any;
  public sumaEgresos:number = 0;

  constructor(
              private routeActive: ActivatedRoute,
              private finanzasServ: FinanzasService,
              private location: Location,
              private fb: FormBuilder,
              private router: Router,

  ) { }

  ngOnInit(): void {
    
    this.finanza = JSON.parse(localStorage.getItem('finanzas')) || [];

    this.idUsuario = this.finanza[0].id_us;

    this.getEgresosById(this.idUsuario);
    this.inicarFormulario();
  }



  /**
  * Método para obtener los ingresos por usuario
  * @param idUs => ID del usuario
  */
 public getEgresosById = (idUs:any) =>{
  this.finanzasServ.getEgresosByIdService(idUs).subscribe( async(resp:any) =>{

    this.egresos = await resp.egresos || [];
    this.sumaValores(this.egresos);

  }, (err) =>{
    console.log(err);
  })
}



  /**
   * Método para insertar ingresos
   */
  public crearEgreso = () =>{
    this.formSubmitted = true;

    if ( this.formCrearEgreso.invalid ) {
      return;
    }
    
    const json = {
      idUs: this.finanza[0].id_us,
      idFina: this.finanza[0].id_fina,
      valor: this.formCrearEgreso.get('valor').value,
      comentario: this.formCrearEgreso.get('comentario').value,
      prestamo: this.formCrearEgreso.get('prestamo').value == true? 1 : 0
    }
    this.finanzasServ.insertEgresosService(json).subscribe( (resp:any) =>{

      Swal.fire('Bien!', resp.msg, 'success');
      setTimeout(() => { window.location.reload(); }, 2000);

    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
      console.error(err.error)
    })

  }


  /**
   * Método para editar el egreso
   */
   public editarEgresoById = () =>{

    this.finanzasServ.updateEgresoService(this.formEditarEgreso.value).subscribe( (resp:any) =>{

      Swal.fire('Bien!', resp.msg, 'success');
      setTimeout(() => { window.location.reload() }, 1500);

    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
    })
  }


  /**
   * Método para eliminar el ingreso
   * @param idIngreso => ID del ingreso a eliminar
   */
   public EliminarEgreso = (idEgreso:any) =>{
    Swal.fire({
      title: '¿Desea eliminar el egreso?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.finanzasServ.deleteEgresoService(idEgreso).subscribe( (resp:any) =>{
          Swal.fire('Bien!',resp.msg,'success');
          setTimeout(() => { window.location.reload(); }, 1500);

        }, (err) =>{
          Swal.fire('Error!',err.error.msg,'error');
          
        })

      }
    });
  }



  /**
   * Método para cargar el formulario de editar
   * @param egreso => Objeto del egreso
   */
  public modalEditarEgreso =(egreso:any) =>{
    const fecha = egreso.fecha_egre.split('T');
    this.formEditarEgreso = this.fb.group({
      valor: [egreso.valor_egre, [Validators.required, Validators.minLength(3)]],
      fecha: [fecha[0], [Validators.required]],
      comentario: [egreso.comentario_egre, [Validators.required, Validators.minLength(5)]],
      idEgreso: [egreso.id_egre, [Validators.required]],
      prestamo: [egreso.prestamo_egre == 1? true: false]
    })

  }



  /**
   * Método para iniciar formulario
   */
  public inicarFormulario = () =>{
    this.formCrearEgreso = this.fb.group({
      valor: ['', [Validators.required, Validators.minLength(3)]],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      prestamo: []
    })

    this.formEditarEgreso = this.fb.group({
      valor: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required]],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      idEgreso: ['', [Validators.required]],
      prestamo: []
    })

    this.formFiltroFechas = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
    })
  }


  /**
   * Método para consultar ingresos por fechas
   */
   public consultarFechasEgresos = () =>{

    if ( this.formFiltroFechas.invalid ) {
      return;
    }

    if (this.formFiltroFechas.get('fechaInicio').value >= this.formFiltroFechas.get('fechaFin').value) {
      Swal.fire('Error!', 'Hay un problema con las fechas.','error');
      return;
    }

    this.sumaEgresos = 0;
    this.finanzasServ.filterFechasEgreService(this.idUsuario, this.formFiltroFechas.value).subscribe( async(resp:any) =>{

      
      this.egresos = await resp.egresos || [];
      this.sumaValores(this.egresos);

    }, (err) =>{ 
      if (err.error.error === 'No hay registros.') {
        Swal.fire('Error!', err.error.error,'error');
      } else{
        Swal.fire('Error!', err.error.msg,'error');

      }
    })


  }




  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formCrearEgreso.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método que suma los valores
   * @param obj => Objeto con datos de consulta
   */
  public sumaValores = (obj:any) =>{
    obj.forEach( (item:any) =>{
      if(item.prestamo_egre == 0){
        this.sumaEgresos += item.valor_egre;
      }
    })
  }




  goBack(){
    this.location.back();
  }



}
