import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CreditosService } from 'src/app/services/creditos.service';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { PagosService } from 'src/app/services/pagos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _unsubscribeAll:Subject<any> = new Subject<any>();

  public usuario:User;
  public clientes:User[];
  public creditos:any[] = [];
  public ingresos:any[] = [];
  public pagos:any[] = [];
  public finanzas:any[] = [];
  public totalPagado:number = 0;

  //Grafica 1
  public lblGrafica1:string[] = [];
  public Data1:any[] = [];

  constructor(
    private clientesServ: UsuarioService,
    private creditosServ: CreditosService,
    private pagosServ: PagosService,
    private finanzaServ: FinanzasService,
    private authServ: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario[0];

    //Obtenemos los clientes
    this.getAllClientes();

    //Obtenemos los créditos
    this.getAllCreditos();

    //Obtenemos los pagos
    this.getAllPagos();

    //Obtenemos las finanzas
    this.getFinanzas(this.usuario.id);

    //Cargar las graficas
    setTimeout(() => { this.cargarGraficas() }, 1000);

  }


  /**
   * Método para obtener los clientes
   */
  public getAllClientes = async() =>{
    this.clientesServ.getClientesService().pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.clientes = resp.usuarios.map((us:any) =>({
        id:        us.id_us,
        nombre:    us.nombre_us,
        email:     us.email_us,
        telefono:  us.telefono_us,
        direccion: us.direccion_us,
        estado:    us.estado_us,
        genero:    us.genero_us,
        admin:     us.admin_us,
        fechareg:  us.fechareg_us,
        avatar:    us.avatar_us
      }));
    }, err => console.error(err));
  }

  /**
   * Método para obtener los créditos
   */
  public getAllCreditos = () =>{
    this.creditosServ.getAllCreditosService().pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.creditos = resp.creditos || [];
    }, err => console.error(err)) ;
  }


  /**
   * Método para obtener los pagos
   */
  public getAllPagos = () =>{
    this.pagosServ.getAllPagosService().pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.pagos = resp.pagos || [];
      this.pagos.forEach( pag =>{
        this.totalPagado += pag.valor_pag;
      })
    }, err => console.error(err))
  }




  /**
   * Método para obtener las finanzas
   */
  public getFinanzas = (idUs:any) =>{
    this.finanzaServ.getFinanzasByIdService(idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.finanzas = resp.finanzas || [];
      localStorage.setItem('finanzas', JSON.stringify(this.finanzas));
    }, err => console.error(err));
  }


  /**
   * Método para cargar la grafica de dona
   */
  public cargarGraficas = () =>{
    this.lblGrafica1 = ['Clientes', 'Créditos', 'Pagos'];
    this.Data1 = [ [this.clientes.length, this.creditos.length, this.pagos.length] ];
    this.getAllIngresosById(this.usuario.id);
  }


  /**
   * Método btener todos los ingresos
   */
  getAllIngresosById = (idUs:number) =>{
    const getIngre$ = this.finanzaServ.getIngresosByIdService(idUs).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.ingresos = resp.ingresos || [];
    }, (err) =>{ console.error(err); getIngre$.unsubscribe()})
  }





}
