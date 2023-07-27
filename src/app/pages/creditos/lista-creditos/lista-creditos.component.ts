import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CreditosService } from 'src/app/services/creditos.service';
import { Router } from '@angular/router';
import { PagosService } from 'src/app/services/pagos.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-lista-creditos',
  templateUrl: './lista-creditos.component.html',
  styleUrls: ['./lista-creditos.component.css']
})
export class ListaCreditosComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public usuario:User;
  public creditos:any[] = [];
  public pagos:any[] = [];
  public finanzas:any[] = [];
  public totalPagos:number = 0;

  constructor(
    private creditosServ: CreditosService,
    private pagosServ: PagosService,
    private router: Router,
    private authServ: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];
    this.finanzas = JSON.parse( localStorage.getItem('finanzas') ) || [];
    this.getAllCreditos()
    this.getAllPagos()
  }


  public getAllCreditos = () =>{
    this.creditosServ.getAllCreditosService(this.usuario.id).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.creditos = resp.creditos || [];
    }, (err) =>{
      console.error(err.error);
    })
  }


  /**
   * Método para obtener todos los pagos
   */
   public getAllPagos = () =>{

    this.pagosServ.getAllPagosService(this.usuario.id).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.pagos = resp.pagos || [];
      this.pagos.forEach( pag =>{
        this.totalPagos += pag.valor_pag;
      })
    }, (err) =>{
      console.log(err)
    })
  }



  /**
   * Método para navegar a ver crédito
   * @param idUs => ID del cliente
   */
  public navegarVerCredito = (idUs:any) =>{
    this.router.navigate(['dashboard/creditos/detalle-credito', idUs]);
  }




}
