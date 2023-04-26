import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { DisplayedColumnsEgre, Egresos } from 'src/app/interfaces/egresos.interface';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-lista-egresos',
  templateUrl: './lista-egresos.component.html',
  styleUrls: ['./lista-egresos.component.css']
})
export class ListaEgresosComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public finanza:any[] = [];
  public egresos:any[] = [];
  public formFiltroFechas:FormGroup;
  public formSubmitted:boolean = false;
  public idUsuario:any;
  public isFilterDate:boolean = false;
  public sumaEgresos:number = 0;
  public dataSource: any;
  public displayedColumns = DisplayedColumnsEgre;

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
    this.getEgresosById(this.idUsuario);
    this.initFormFechas();
  }



  /**
  * Método para obtener los ingresos por usuario
  * @param idUs => ID del usuario
  */
  public getEgresosById = (idUs:any) =>{
    const getEgre$ = this.finanzasServ.getEgresosByIdService(idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( async(resp:any) =>{
      this.egresos = await resp.egresos || [];
      this.initMatTable(this.egresos);    
      this.sumaValores(this.egresos);
    }, (err) =>{
      console.log(err);
      getEgre$.unsubscribe();
    })
  }



  /**
   * Método para eliminar el ingreso
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
        const deleteEgre$ = this.finanzasServ.deleteEgresoService(idEgreso).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
          this.toastrSvc.success('Se eliminó el egreso correctamente!', 'Bien!');
          this.egresos = this.egresos.filter(ing => ing.id_egre !== idEgreso);
          this.initMatTable(this.egresos);
        }, (err) =>{
          console.log(err);
          this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
          deleteEgre$.unsubscribe();
        })
      }
    });
  }


  /**
   * Método para ver el detalle del egreso 
   */
  public viewDetailEgre = (id:string) =>{
    this.router.navigate(['/dashboard/egresos/detalle-egreso', id])
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
   * Método para consultar ingresos por fechas
   */
   public consultarFechasEgresos = () =>{

    if ( this.formFiltroFechas.invalid ) {
      return;
    }
    if (this.formFiltroFechas.get('fechaInicio').value >= this.formFiltroFechas.get('fechaFin').value) {
      this.toastrSvc.error(`Hay un problema con las fechas...`, 'Uppsss!');
      return;
    }
    this.sumaEgresos = 0;
    const filter$ = this.finanzasServ.filterFechasEgreService(this.idUsuario, this.formFiltroFechas.value).pipe(takeUntil(this._unsubscribeAll)).subscribe( async(resp:any) =>{
      this.egresos = await resp.egresos || [];
      this.initMatTable(this.egresos);
      this.sumaValores(this.egresos);
      this.isFilterDate = true;
    }, (err) =>{ 
      if (err.error.error === 'No hay registros.') {
        this.toastrSvc.error(`${err.error.error}`, 'Uppsss!');
      } else{
        this.toastrSvc.error(`${err.error.error}`, 'Uppsss!');
      }
      filter$.unsubscribe();
    })


  }


  public cleanFilters = () =>{
    this.isFilterDate = false;
    this.getEgresosById(this.idUsuario);
  }


  /**
   * Método que suma los valores
   */
  public sumaValores = (obj:any) =>{
    obj.forEach( (item:any) =>{
      if(item.prestamo_egre == 0){
        this.sumaEgresos += item.valor_egre;
      }
    })
  }


  public initMatTable = (data:Egresos[]) =>{
    this.dataSource = new MatTableDataSource<Egresos>(data);
    this.dataSource.paginator = this.paginator;
  }


  public navegarEditEgreso = (id:String) =>{
    this.router.navigate(['/dashboard/egresos/editar-egreso', id]);
  }


  goBack(){
    this.location.back();
  }


}
