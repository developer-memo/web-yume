import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CreditosService } from 'src/app/services/creditos.service';
import { Router } from '@angular/router';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-lista-creditos',
  templateUrl: './lista-creditos.component.html',
  styleUrls: ['./lista-creditos.component.css']
})
export class ListaCreditosComponent implements OnInit {

  public creditos:any[] = [];
  public pagos:any[] = [];
  public finanzas:any[] = [];
  public totalPagos:number = 0;

  constructor(
              private creditosServ: CreditosService,
              private pagosServ: PagosService,
              private router: Router,
  ) { }

  ngOnInit(): void {
    this.finanzas = JSON.parse( localStorage.getItem('finanzas') ) || [];

    this.getAllCreditos()
    this.getAllPagos()
  }


  public getAllCreditos = () =>{
    this.creditosServ.getAllCreditosService().subscribe( (resp:any) =>{

      this.creditos = resp.creditos || [];
      console.log(this.creditos)

    }, (err) =>{
      console.error(err.error);
    })
  }


  /**
   * Método para obtener todos los pagos
   */
   public getAllPagos = () =>{

    this.pagosServ.getAllPagosService().subscribe( (resp:any) =>{

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
    this.router.navigate(['dashboard/detalle-credito', idUs]);
  }




}
