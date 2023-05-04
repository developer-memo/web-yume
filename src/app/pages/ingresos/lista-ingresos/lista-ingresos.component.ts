import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Ingresos, DisplayedColumnsIngre } from 'src/app/interfaces/ingresos.interface';


@Component({
  selector: 'app-lista-ingresos',
  templateUrl: './lista-ingresos.component.html',
  styleUrls: ['./lista-ingresos.component.css']
})
export class ListaIngresosComponent implements OnInit, OnDestroy  {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public finanza:any[] = [];
  public ingresos:any[] = [];
  public formFiltroFechas:FormGroup;
  public idUsuario:any;
  public isFilterDate:boolean = false;
  public sumaIngresos:number = 0;
  public dataSource: any;
  public displayedColumns = DisplayedColumnsIngre;

  constructor(
    private finanzasServ: FinanzasService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private toastrSvc: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
  ) {
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
  }

  // Unsubscribe from all subscriptions
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {

    this.finanza = JSON.parse(localStorage.getItem('finanzas')) || [];
    this.idUsuario = this.finanza[0].id_us;
    this.getIngresosById(this.idUsuario);
    this.initFormFechas();
  }


  /**
  * Método para obtener los ingresos por usuario
  * @param idUs => ID del usuario
  */
  public getIngresosById = (idUs:any) =>{
    const getIngre$ = this.finanzasServ.getIngresosByIdService(idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.ingresos = resp.ingresos || [];
      console.log(this.ingresos);
      this.initMatTable(this.ingresos);
      this.sumaValores(this.ingresos);
    }, (err) =>{ console.error(err); getIngre$.unsubscribe()})
  }


  /**
   * Método para iniciar formulario
   */
  public initFormFechas = () =>{
    this.formFiltroFechas = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
    })
  }



  /**
   * Método para eliminar el ingreso
   */
  public EliminarIngreso = (idIngreso:any) =>{
    Swal.fire({
      title: '¿Desea eliminar el ingreso?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteIngre$ = this.finanzasServ.deleteIngresoService(idIngreso).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
          this.toastrSvc.success('Se eliminó el ingreso correctamente!', 'Bien!');
          this.ingresos = this.ingresos.filter(ing => ing.id_ingre !== idIngreso);
          this.initMatTable(this.ingresos);
        }, (err) =>{
          console.log(err);
          this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
          deleteIngre$.unsubscribe();
        })
      }
    });
  }


  /**
   * Método para ver el detalle del ingreso
   */
  public viewDetailIngre = (id:string) =>{
    this.router.navigate(['/dashboard/ingresos/detalle-ingreso', id])
  }


  /**
   * Método para consultar ingresos por fechas
   */
  public consultarFechasIngresos = () =>{
    if ( this.formFiltroFechas.invalid ) {
      return;
    }
    if (this.formFiltroFechas.get('fechaInicio').value >= this.formFiltroFechas.get('fechaFin').value) {
      this.toastrSvc.error(`Hay un problema con las fechas...`, 'Uppsss!');
      //setTimeout(() => { Swal.close();  }, 2000);
      return;
    }
    this.sumaIngresos = 0;
    const filter$ = this.finanzasServ.filterFechasIngreService(this.idUsuario, this.formFiltroFechas.value).pipe(takeUntil(this._unsubscribeAll)).subscribe( async(resp:any) =>{
      this.ingresos = await resp.ingresos || [];
      this.initMatTable(this.ingresos);
      this.sumaValores(this.ingresos);
      this.isFilterDate = true;
    }, (err) =>{
      if (err.error.error === 'No hay registros.') {
        this.toastrSvc.error(`${err.error.error}`, 'Uppsss!');
      } else{
        this.toastrSvc.error(`${err.error.msg}`, 'Uppsss!');
      }
      filter$.unsubscribe();
    })
  }

  public cleanFilters = () =>{
    this.isFilterDate = false;
    this.getIngresosById(this.idUsuario);
  }

  /**
   * Método que suma los valores
   */
   public sumaValores = (obj:any) =>{
    obj.forEach( (item:any) =>{
      if(item.pago_credito_ingre == 0){
        this.sumaIngresos += item.valor_ingre;
      }
    })
  }



  public initMatTable = (data:Ingresos[]) =>{
    this.dataSource = new MatTableDataSource<Ingresos>(data);
    this.dataSource.paginator = this.paginator;
  }


  public goCreateIngre = () =>{
    this.router.navigateByUrl('/dashboard/ingresos/crear-ingreso')
  }


  public navegarEditIngreso = (id:String) =>{
    this.router.navigate(['/dashboard/ingresos/editar-ingreso', id]);
  }


  goBack(){
    this.location.back();
  }

}
