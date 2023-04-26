import { CurrencyPipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Egresos, dropdownTypeEgre } from 'src/app/interfaces/egresos.interface';
import { FinanzasService } from 'src/app/services/finanzas.service';

@Component({
  selector: 'app-editar-egreso',
  templateUrl: './editar-egreso.component.html',
  styleUrls: ['./editar-egreso.component.css']
})
export class EditarEgresoComponent implements OnInit, OnDestroy {

  private _unsubscribe: Subject<any> = new Subject<any>();
  private debounceTimer?: NodeJS.Timeout;
  public formEditEgre: FormGroup;
  public idEgre: string;
  public amoutValue: any;
  public egreso:Egresos;
  public formSubmitted:boolean = false;
  public dropdownSettings;
  public dropdownList = dropdownTypeEgre;

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
      this.idEgre = param.get('id');
    });
    this.getEgreso();
  }


  //Get egreso por id
  public getEgreso = () =>{
    const getEgre$ = this.finanzasSrv.getEgresoService(this.idEgre).pipe(takeUntil(this._unsubscribe)).subscribe((resp:any) =>{
      this.egreso = resp.egreso[0];
      this.formInit(this.egreso);
      this.currencyFormatted();
    }, err =>{
      console.log(err);
      this.toastrSvc.error(`${err.error.msg}..`, 'Uppsss!');
      getEgre$.unsubscribe();
      setTimeout(() => { this.location.back(); }, 1500);
    })
  }


  public formInit = (egreso:Egresos) =>{
    const tipo = JSON.parse(egreso.tipo_egre)
    const detalles = JSON.parse(egreso.detalles_egre);
    const fecha = egreso.fecha_egre.split('T');

    this.formEditEgre = this.fb.group({
      valor: [this.currencyPipe.transform(egreso.valor_egre, 'USD', 'symbol', '3.0'), [Validators.required, Validators.minLength(3)]],
      tipoTmp: [tipo, [Validators.required]],
      tipo: [''],
      comentario: [egreso.comentario_egre, [Validators.required, Validators.minLength(5)]],
      prestamo: [egreso.prestamo_egre == 1? true: false],
      detalles: [''],
      detallesTmp: this.fb.array([this.fb.group({
        detalle: [''],
        valorDet: [''],
      })]),
      id: [this.idEgre],
      fecha: [fecha[0]]
    });
    const control = <FormArray>this.formEditEgre.controls['detallesTmp'];
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
      const control = <FormArray>this.formEditEgre.controls['detallesTmp'];
      control.value.forEach( det =>{
        if (Number.isNaN(+det.valorDet)){return}
        amount = amount + +det.valorDet
      });
      this.amoutValue = amount;
      this.formEditEgre.patchValue({
        ['valor']: this.currencyPipe.transform(this.amoutValue, 'USD', 'symbol', '3.0')
      })
    }, 1000);
  }

  

  public onTypeIngreSelect =(event:Event) =>{}

  get getDetalles(){
    return this.formEditEgre.get('detallesTmp') as FormArray;
  }

  public addDetalle = () =>{
    const control = <FormArray>this.formEditEgre.controls['detallesTmp'];
    control.push(this.fb.group({
      detalle: [''],
      valorDet: [''],
    }))
  }
  public removeDetalle = (index:number) =>{
    const control = <FormArray>this.formEditEgre.controls['detallesTmp'];
    control.removeAt(index);
    this.addAmountValue()
  }


  /**
   * Método para formatear valor a moneda
   */
  public currencyFormatted = () =>{
    this.formEditEgre.valueChanges.subscribe( form =>{
      if (form.valor) {
        this.formEditEgre.patchValue({
          valor: this.currencyPipe.transform( form.valor.replace(/\D/g, '').replace(/^0+/, ''), 'USD', 'symbol', '3.0' )
        }, {emitEvent:false});
      }
    });
  }


  public submitEditEgreso = () =>{
    this.formSubmitted = true;
    if ( this.formEditEgre.invalid ) {return;}
    this.formEditEgre.patchValue({
      ['detalles']: JSON.stringify(this.formEditEgre.get('detallesTmp').value)
    });
    this.formEditEgre.patchValue({
      ['tipo']: JSON.stringify(this.formEditEgre.get('tipoTmp').value)
    });

    const updateEgre$ = this.finanzasSrv.updateEgresoService(this.formEditEgre.value).pipe(takeUntil(this._unsubscribe)).subscribe( (resp:any) =>{
      this.toastrSvc.success(`${resp.msg}`, 'Bien!');
      setTimeout(() => {this.router.navigate(['dashboard/egresos'])}, 1000);
    }, (err) =>{
      console.log(err);
      this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
      updateEgre$.unsubscribe();
    })
    
  }



  /**
   * Método para validar los campos del formulario
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formEditEgre.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  goBack(){
    this.location.back();
  }

}
