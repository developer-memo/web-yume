import { Component, OnInit } from '@angular/core';
import { PagosService } from 'src/app/services/pagos.service';

@Component({
  selector: 'app-lista-pagos',
  templateUrl: './lista-pagos.component.html',
  styleUrls: ['./lista-pagos.component.css']
})
export class ListaPagosComponent implements OnInit {

  public pagos:any[] = [];
  public finanzas:any[] = [];
  public totalPagos:number = 0;

  constructor(
              private pagosServ: PagosService
  ) { }

  ngOnInit(): void {
    this.finanzas = JSON.parse( localStorage.getItem('finanzas') ) || [];

    this.getAllPagos();
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


  public navegarVerCredito = () =>{
    
  }




}
