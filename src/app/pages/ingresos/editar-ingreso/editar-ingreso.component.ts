import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { Ingresos, dropdownTypeIngre } from 'src/app/interfaces/ingresos.interface';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, Location } from '@angular/common';

@Component({
  selector: 'app-editar-ingreso',
  templateUrl: './editar-ingreso.component.html',
  styleUrls: ['./editar-ingreso.component.css']
})
export class EditarIngresoComponent implements OnInit, OnDestroy {

  private _unsubscribe: Subject<any> = new Subject<any>();
  private debounceTimer?: NodeJS.Timeout;
  public formEditIngre: FormGroup;
  public idIngre: string;
  public amoutValue: any;
  public ingreso:Ingresos;
  public formSubmitted:boolean = false;
  public dropdownSettings;
  public dropdownList = dropdownTypeIngre;

  constructor(
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private finanzasSrv: FinanzasService,
    private toastrSvc: ToastrService,
    private location: Location,
    private currencyPipe: CurrencyPipe,
    private router:Router
  ) { }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this.actRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe( param =>{
      this.idIngre = param.get('id');
    });
    this.getIngreso();
  }


  //Get ingreso por id
  public getIngreso = () =>{
    const getIngre$ = this.finanzasSrv.getIngresoService(this.idIngre).pipe(takeUntil(this._unsubscribe)).subscribe((resp:any) =>{
      this.ingreso = resp.ingreso[0];
      this.formInit(this.ingreso);
      this.currencyFormatted();
    }, err =>{
      console.log(err);
      this.toastrSvc.error(`${err.error.msg}..`, 'Uppsss!');
      getIngre$.unsubscribe();
      setTimeout(() => { this.location.back(); }, 1500);
    });
  }


  public formInit = (ingreso:Ingresos) =>{
    const tipo = JSON.parse(ingreso.tipo_ingre)
    const detalles = JSON.parse(ingreso.detalles_ingre);
    const fecha = ingreso.fecha_ingre.split('T');

    this.formEditIngre = this.fb.group({
      valor: [this.currencyPipe.transform(ingreso.valor_ingre, 'USD', 'symbol', '3.0'), [Validators.required, Validators.minLength(3)]],
      tipoTmp: [tipo, [Validators.required]],
      tipo: [''],
      comentario: [ingreso.comentario_ingre, [Validators.required, Validators.minLength(5)]],
      pagoCredito: [ingreso.pago_credito_ingre == 1? true: false],
      detalles: [''],
      detallesTmp: this.fb.array([this.fb.group({
        detalle: [''],
        valorDet: [''],
      })]),
      id: [this.idIngre],
      fecha: [fecha[0]]
    });
    const control = <FormArray>this.formEditIngre.controls['detallesTmp'];
    detalles.forEach(element => {
      control.push(this.fb.group({
        detalle: [element.detalle],
        valorDet: [element.valorDet],
      }));
    });
    this.removeDetalle(0)
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
      const control = <FormArray>this.formEditIngre.controls['detallesTmp'];
      control.value.forEach( det =>{
        if (Number.isNaN(+det.valorDet)){return}
        amount = amount + +det.valorDet
      });
      this.amoutValue = amount;
      this.formEditIngre.patchValue({
        ['valor']: this.currencyPipe.transform(this.amoutValue, 'USD', 'symbol', '3.0')
      })
    }, 1000);
  }


  public submitEditIngreso = () =>{
    this.formSubmitted = true;
    if ( this.formEditIngre.invalid ) {return;}
    this.formEditIngre.patchValue({
      ['detalles']: JSON.stringify(this.formEditIngre.get('detallesTmp').value)
    });
    this.formEditIngre.patchValue({
      ['tipo']: JSON.stringify(this.formEditIngre.get('tipoTmp').value)
    });

    const updateIngre$ = this.finanzasSrv.updateIngresoService(this.formEditIngre.value).pipe(takeUntil(this._unsubscribe)).subscribe( (resp:any) =>{
      this.toastrSvc.success(`${resp.msg}`, 'Bien!');
      setTimeout(() => {this.router.navigate(['dashboard/ingresos'])}, 1000);
    }, (err) =>{
      console.log(err);
      this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
      updateIngre$.unsubscribe();
    })
    
  }




  public onTypeIngreSelect =(event:Event) =>{}

  get getDetalles(){
    return this.formEditIngre.get('detallesTmp') as FormArray;
  }

  public addDetalle = () =>{
    const control = <FormArray>this.formEditIngre.controls['detallesTmp'];
    control.push(this.fb.group({
      detalle: [''],
      valorDet: [''],
    }))
  }
  public removeDetalle = (index:number) =>{
    const control = <FormArray>this.formEditIngre.controls['detallesTmp'];
    control.removeAt(index);
    this.addAmountValue()
  }



  /**
   * Método para formatear valor a moneda
   */
  public currencyFormatted = () =>{
    this.formEditIngre.valueChanges.subscribe( form =>{
      if (form.valor) {
        this.formEditIngre.patchValue({
          valor: this.currencyPipe.transform( form.valor.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '3.0' )
        }, {emitEvent:false});
      }
    });
  }


  /**
   * Método para validar los campos del formulario
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formEditIngre.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  goBack(){
    this.location.back();
  }

}
