import { CurrencyPipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Finanzas } from 'src/app/interfaces/finanzas.interface';
import { dropdownTypeIngre } from 'src/app/interfaces/ingresos.interface';
import { FinanzasService } from 'src/app/services/finanzas.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-crear-ingreso',
  templateUrl: './crear-ingreso.component.html',
  styleUrls: ['./crear-ingreso.component.css']
})
export class CrearIngresoComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private debounceTimer?: NodeJS.Timeout;
  public formCrearIngreso: FormGroup;
  public formSubmitted: boolean = false;
  public amoutValue: any;
  public dropdownSettings;
  public dropdownList = dropdownTypeIngre;
  public finanza: Finanzas;

  constructor(
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private toastrSvc: ToastrService,
    private finanzasServ: FinanzasService,
    private router: Router,
    private location: Location,
    private spinnerSrv: SpinnerService
  ) {}

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

  public formInit = () => {
    this.formCrearIngreso = this.fb.group({
      valor: ['', [Validators.required, Validators.minLength(3)]],
      tipoTmp: ['', [Validators.required]],
      tipo: [''],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      pagoCredito: [],
      detalles: [''],
      detallesTmp: this.fb.array([
        this.fb.group({
          detalle: [''],
          valorDet: ['']
        })
      ])
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tipo',
      textField: 'text_tipo',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deshacer selección'
    };
  };

  public addAmountValue = () => {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    let amount = 0;
    this.debounceTimer = setTimeout(() => {
      const control = <FormArray>this.formCrearIngreso.controls['detallesTmp'];
      control.value.forEach(det => {
        if (Number.isNaN(+det.valorDet)) {
          return;
        }
        amount = amount + +det.valorDet;
      });
      this.amoutValue = amount;
      this.formCrearIngreso.patchValue({
        ['valor']: this.currencyPipe.transform(
          this.amoutValue,
          'USD',
          'symbol',
          '3.0'
        )
      });
    }, 1000);
  };

  get getDetalles() {
    return this.formCrearIngreso.get('detallesTmp') as FormArray;
  }

  public addDetalle = () => {
    const control = <FormArray>this.formCrearIngreso.controls['detallesTmp'];
    control.push(
      this.fb.group({
        detalle: [''],
        valorDet: ['']
      })
    );
  };
  public removeDetalle = (index: number) => {
    const control = <FormArray>this.formCrearIngreso.controls['detallesTmp'];
    control.removeAt(index);
  };

  /**
   * Método para insertar ingresos
   */
  public crearIngreso = () => {
    this.formSubmitted = true;
    if (this.formCrearIngreso.invalid) {
      return;
    }

    this.formCrearIngreso.patchValue({
      ['detalles']: JSON.stringify(
        this.formCrearIngreso.get('detallesTmp').value
      )
    });
    this.formCrearIngreso.patchValue({
      ['tipo']: JSON.stringify(this.formCrearIngreso.get('tipoTmp').value)
    });

    const json = {
      idUs: this.finanza.id_us,
      idFina: this.finanza.id_fina,
      valor: this.formCrearIngreso.get('valor').value,
      comentario: this.formCrearIngreso.get('comentario').value,
      tipo: this.formCrearIngreso.get('tipo').value,
      detalles: this.formCrearIngreso.get('detalles').value,
      pagoCredito:
        this.formCrearIngreso.get('pagoCredito').value == true ? 1 : 0
    };
    json.valor = Number(json.valor.slice(1, 100).replaceAll(',', ''));

    this.spinnerSrv.show();

    const insert$ = this.finanzasServ
      .insertIngresosService(json)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (resp: any) => {
          this.toastrSvc.success(`${resp.msg}`, 'Bien!');
          this.spinnerSrv.hide();
          setTimeout(() => {
            this.router.navigate(['dashboard/ingresos']);
          }, 1000);
        },
        err => {
          console.log(err);
          this.spinnerSrv.hide();
          this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
          insert$.unsubscribe();
        }
      );
  };

  public onTypeIngreSelect = (event: Event) => {
    //this.formCrearIngreso.patchValue({['tipo']: event['tipo'] });
  };

  /**
   * Método para formatear valor a moneda
   */
  public currencyFormatted = () => {
    this.formCrearIngreso.valueChanges.subscribe(form => {
      if (form.valor) {
        this.formCrearIngreso.patchValue(
          {
            valor: this.currencyPipe.transform(
              form.valor.replace(/\D/g, '').replace(/^0+/, ''),
              'USD',
              'symbol',
              '3.0'
            )
          },
          { emitEvent: false }
        );
      }
    });
  };

  /**
   * Método para validar los campos del formulario
   */
  public campoNoValido = (campo: any): boolean => {
    if (this.formCrearIngreso.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  };

  goBack() {
    this.location.back();
  }
}
