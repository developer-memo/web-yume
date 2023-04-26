import { CurrencyPipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { dropdownTypeEgre } from 'src/app/interfaces/egresos.interface';
import { Finanzas } from 'src/app/interfaces/finanzas.interface';
import { FinanzasService } from 'src/app/services/finanzas.service';

@Component({
  selector: 'app-crear-egreso',
  templateUrl: './crear-egreso.component.html',
  styleUrls: ['./crear-egreso.component.css']
})
export class CrearEgresoComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private debounceTimer?: NodeJS.Timeout;
  public formCrearEgreso:FormGroup;
  public formSubmitted:boolean = false;
  public amoutValue: any;
  public dropdownSettings;
  public dropdownList = dropdownTypeEgre;
  public finanza:Finanzas;

  constructor(
    private currencyPipe: CurrencyPipe,
    private toastrSvc: ToastrService,
    private finanzasServ: FinanzasService,
    private router:Router,
    private fb: FormBuilder,
    private location: Location,
  ) { }

  // Unsubscribe from all subscriptions
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.finanza = JSON.parse(localStorage.getItem('finanzas'))[0];
    this.formInit();
    this.currencyFormatted();
  }


  public formInit = () =>{
    this.formCrearEgreso = this.fb.group({
      valor: ['', [Validators.required, Validators.minLength(3)]],
      tipoTmp: ['', [Validators.required]],
      tipo: [''],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      prestamo: [],
      detalles: [''],
      detallesTmp: this.fb.array([this.fb.group({
        detalle: [''],
        valorDet: [''],
      })])
    })
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tipo',
      textField: 'text_tipo',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deshacer selección',
    }
  }

  public addAmountValue = () =>{
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    let amount = 0;
    this.debounceTimer = setTimeout(() => {
      const control = <FormArray>this.formCrearEgreso.controls['detallesTmp'];
      control.value.forEach( det =>{
        if (Number.isNaN(+det.valorDet)){return}
        amount = amount + +det.valorDet
      });
      this.amoutValue = amount;
      this.formCrearEgreso.patchValue({
        ['valor']: this.currencyPipe.transform(this.amoutValue, 'USD', 'symbol', '3.0')
      })
    }, 1000);
  }

  get getDetalles(){
    return this.formCrearEgreso.get('detallesTmp') as FormArray;
  }

  public addDetalle = () =>{
    const control = <FormArray>this.formCrearEgreso.controls['detallesTmp'];
    control.push(this.fb.group({
      detalle: [''],
      valorDet: [''],
    }))
  }
  public removeDetalle = (index:number) =>{
    const control = <FormArray>this.formCrearEgreso.controls['detallesTmp'];
    control.removeAt(index);
  }


  /**
   * Método para insertar egresos
   */
  public crearEgreso = () =>{
    this.formSubmitted = true;
    if ( this.formCrearEgreso.invalid ) {return;}

    this.formCrearEgreso.patchValue({
      ['detalles']: JSON.stringify(this.formCrearEgreso.get('detallesTmp').value)
    });
    this.formCrearEgreso.patchValue({
      ['tipo']: JSON.stringify(this.formCrearEgreso.get('tipoTmp').value)
    });

    const json = {
      idUs: this.finanza.id_us,
      idFina: this.finanza.id_fina,
      valor: this.formCrearEgreso.get('valor').value,
      comentario: this.formCrearEgreso.get('comentario').value,
      tipo: this.formCrearEgreso.get('tipo').value,
      detalles: this.formCrearEgreso.get('detalles').value,
      prestamo: this.formCrearEgreso.get('prestamo').value == true? 1 : 0
    }
    json.valor = Number(json.valor.slice(1,100).replaceAll(',', ''));

    const insert$ = this.finanzasServ.insertEgresosService(json).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.toastrSvc.success(`${resp.msg}`, 'Bien!');
      setTimeout(() => {this.router.navigate(['dashboard/egresos'])}, 1000);
    }, (err) =>{
      console.log(err);
      this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
      insert$.unsubscribe();
    });
  }


  public onTypeIngreSelect =(event:Event) =>{
    //this.formCrearEgreso.patchValue({['tipo']: event['tipo'] });
  }


  /**
   * Método para formatear valor a moneda
   */
  public currencyFormatted = () =>{
    this.formCrearEgreso.valueChanges.subscribe( form =>{
      if (form.valor) {
        this.formCrearEgreso.patchValue({
          valor: this.currencyPipe.transform( form.valor.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '3.0' )
        }, {emitEvent:false});
      }
    });
  }


  /**
   * Método para validar los campos del formulario
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formCrearEgreso.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  goBack(){
    this.location.back();
  }

}
