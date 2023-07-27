import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PagosService } from 'src/app/services/pagos.service';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista-pagos',
  templateUrl: './lista-pagos.component.html',
  styleUrls: ['./lista-pagos.component.css']
})
export class ListaPagosComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public usuario:User;
  public pagos:any[] = [];
  public finanzas:any[] = [];
  public totalPagos:number = 0;

  constructor(
    private pagosServ: PagosService,
    private authServ: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];
    this.finanzas = JSON.parse( localStorage.getItem('finanzas') ) || [];
    this.getAllPagos();
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


  public navegarVerCredito = () =>{

  }




}
