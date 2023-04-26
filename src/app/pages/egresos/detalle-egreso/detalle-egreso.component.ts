import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Egresos } from 'src/app/interfaces/egresos.interface';
import { Finanzas } from 'src/app/interfaces/finanzas.interface';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-egreso',
  templateUrl: './detalle-egreso.component.html',
  styleUrls: ['./detalle-egreso.component.css']
})
export class DetalleEgresoComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public idEgre: string;
  public totalValor: number = 0;
  public egreso:Egresos;
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
      this.idEgre = resp.get('id');
    });
    this.getInfoEgre();
  }


  /**
   * Obtener datos del ingreso
   */
  public getInfoEgre = () =>{
    this.finanzas = JSON.parse(localStorage.getItem('finanzas'))[0];
    const egreSrv$ = this.finanzasSrv.getEgresoService(this.idEgre).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.egreso = resp.egreso[0];

      console.log(this.egreso);
  
      this.tipos = JSON.parse(this.egreso.tipo_egre);
      this.detalles = JSON.parse(this.egreso.detalles_egre);
      this.detalles.forEach( (val:any) =>{ this.totalValor += +val.valorDet });

    }, err =>{
      console.log(err);
      this.toastrSvc.error(`${err.error.msg}..`, 'Uppsss!');
      egreSrv$.unsubscribe();
      setTimeout(() => { this.location.back(); }, 1500);
    })
  }


  goBack(){
    this.location.back();
  }

}
