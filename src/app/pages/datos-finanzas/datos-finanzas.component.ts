import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { Router } from '@angular/router';
import { JsonpInterceptor } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-datos-finanzas',
  templateUrl: './datos-finanzas.component.html',
  styleUrls: ['./datos-finanzas.component.css']
})
export class DatosFinanzasComponent implements OnInit {

  public finanza:any[] = [];
  public ingresos:any[] = [];
  public egresos:any[] = [];
  public usuario:any[] = [];
  public valIngresos:number = 0;
  public valEgresos:number = 0;
  public totalAcumula:number = 0;
  public saldoRojo:string = '';

  constructor(
              private finanzasServ: FinanzasService,
              private authServ: AuthService,
              private location: Location,
              private router: Router,
  ) { }

  ngOnInit(): void {

    this.usuario = this.authServ.usuario || [];
    this.getFinanzasById(this.usuario[0].id_us);
  }



  /**
   * Método para obtener las finanzas por usuario
   * @param idUs => ID del usuario
   */
  public getFinanzasById = (idUs:any) =>{
    this.finanza = JSON.parse(localStorage.getItem('finanzas')).map(  (fina:any) => fina ) || [];
    
    //Obtenemos los ingresos
      this.finanzasServ.getIngresosByIdService(idUs).subscribe( (resp2:any) =>{
      this.ingresos = resp2.ingresos || [];
      this.ingresos.forEach( ingre =>{
        this.valIngresos += ingre.valor_ingre;
      });
    }, (err) =>{ console.error(err)});


    //Obtenemos los egresos
    this.finanzasServ.getEgresosByIdService(idUs).subscribe( (resp3:any) =>{
      this.egresos = resp3.egresos || [];
      this.egresos.forEach( egre =>{
        this.valEgresos += egre.valor_egre;
      })
      //this.valIngresos -= this.valEgresos;
    }, (err) =>{ console.error(err)})
    
    setTimeout(() => {
      this.totalAcumula = this.valIngresos - this.valEgresos;
      this.totalAcumula < this.finanza[0].base_fina ? this.saldoRojo = 'saldoRojo' : '';
    }, 2000);
  }


  public getTotalAcumulado = () =>{

  }


  goBack(){
    this.location.back();
  }

}
