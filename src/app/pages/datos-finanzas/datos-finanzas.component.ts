import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { Router } from '@angular/router';
import { JsonpInterceptor } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { map, tap, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { Egresos } from 'src/app/interfaces/egresos.interface';
import { Ingresos } from 'src/app/interfaces/ingresos.interface';

@Component({
  selector: 'app-datos-finanzas',
  templateUrl: './datos-finanzas.component.html',
  styleUrls: ['./datos-finanzas.component.css']
})
export class DatosFinanzasComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public finanza:any = [];
  public ingresos:Ingresos[] = [];
  public ingresosActual:Ingresos[];
  public egresos:Egresos[];
  public egresosActual:Egresos[];
  public usuario:User;
  public valIngresos:number = 0;
  public ingresosMes:number = 0;
  public valEgresos:number = 0;
  public egresosMes:number = 0;
  public totalAcumula:number = 0;
  public totalAcumulaMes:number = 0;
  public percentTA:number;
  public percentEgre:number;
  public percentIngre:number;
  public saldoRojo:string = '';
  public saldoRojoMes:string = '';
  public nombreMes:string = '';
  public year = new Date().getFullYear();


  constructor(
              private finanzasServ: FinanzasService,
              private authServ: AuthService,
              private location: Location,
              private router: Router,
  ) { }

  // Unsubscribe from all subscriptions
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];
    this.getFinanzasById(this.usuario.id);

  }



  /**
   * Método para obtener las finanzas por usuario
   */
  public getFinanzasById = (idUs:any) =>{
    this.finanza = JSON.parse(localStorage.getItem('finanzas'))[0];

    //Obtenemos los ingresos
    const getIngre$ = this.finanzasServ.getIngresosByIdService(idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.ingresos = resp.ingresos || [];
      this.getIngresosActual(this.ingresos);

      this.ingresos.forEach( ingre =>{
        this.valIngresos += ingre.valor_ingre;
      });
    }, (err) =>{ console.error(err); getIngre$.unsubscribe()});


    //Obtenemos los egresos
    const getEgre$ = this.finanzasServ.getEgresosByIdService(idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{

      this.egresos = resp.egresos || [];
      this.getEgresosActual(this.egresos);

      this.egresos.forEach( egre =>{
        this.valEgresos += egre.valor_egre;
      })
      //this.valIngresos -= this.valEgresos;
    }, (err) =>{ console.error(err); getEgre$.unsubscribe()})

    setTimeout(() => {
      this.totalAcumula = this.valIngresos - this.valEgresos;
      this.totalAcumula < this.finanza.base_fina ? this.saldoRojo = 'saldoRojo' : '';
      this.totalAcumulaMes = this.ingresosMes - this.egresosMes;
      this.totalAcumulaMes < 0 ? this.saldoRojoMes = 'saldoRojo' : '';
      this.percentTA = ( this.totalAcumulaMes * 100 )/this.ingresosMes;
      this.percentEgre = ( this.valEgresos * 100 )/this.valIngresos;
      this.percentIngre = ( this.totalAcumula * 100 )/this.valIngresos;

    }, 2000);

    this.nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date());
  }


  public getIngresosActual = (ingresos:any) =>{
    const mesActual = new Date().toISOString().split('T')[0].slice(0,7);

    this.ingresosActual = ingresos.filter( ing => ing.fecha_ingre.split('T')[0].slice(0,7) == mesActual);

    this.ingresosActual.forEach( ingre =>{
      this.ingresosMes += ingre.valor_ingre;
    });
  }

  public getEgresosActual = (egresos:any) =>{
    const mesActual = new Date().toISOString().split('T')[0].slice(0,7);

    this.egresosActual = egresos.filter( egr => egr.fecha_egre.split('T')[0].slice(0,7) == mesActual);

    this.egresosActual.forEach( egre =>{
      this.egresosMes += egre.valor_egre;
    });
  }


  goBack(){
    this.location.back();
  }

}
