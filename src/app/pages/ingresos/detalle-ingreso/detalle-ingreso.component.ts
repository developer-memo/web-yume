import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { takeUntil } from 'rxjs/operators';
import { Ingresos } from 'src/app/interfaces/ingresos.interface';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Finanzas } from 'src/app/interfaces/finanzas.interface';

@Component({
  selector: 'app-detalle-ingreso',
  templateUrl: './detalle-ingreso.component.html',
  styleUrls: ['./detalle-ingreso.component.css']
})
export class DetalleIngresoComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public idIngre: string;
  public totalValor: number = 0;
  public ingreso:Ingresos;
  public finanzas: Finanzas;
  public tipos:string[];
  public detalles:string[];

  constructor(
    private route: ActivatedRoute,
    private finanzasSrv: FinanzasService,
    private toastrSvc: ToastrService,
    private location: Location,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( resp =>{
      this.idIngre = resp.get('id');
    });
    this.getInfoIngre();
  }


  /**
   * Obtener datos del ingreso
   */
  public getInfoIngre = () =>{
    this.finanzas = JSON.parse(localStorage.getItem('finanzas'))[0];
    const ingreSrv$ = this.finanzasSrv.getIngresoService(this.idIngre).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.ingreso = resp.ingreso[0];
      this.tipos = JSON.parse(this.ingreso.tipo_ingre);
      this.detalles = JSON.parse(this.ingreso.detalles_ingre);
      this.detalles.forEach( (val:any) =>{ this.totalValor += +val.valorDet });

    }, err =>{
      console.log(err);
      this.toastrSvc.error(`${err.error.msg}..`, 'Uppsss!');
      ingreSrv$.unsubscribe();
      setTimeout(() => { this.location.back(); }, 1500);
    })
  }



  goBack(){
    this.location.back();
  }

}
