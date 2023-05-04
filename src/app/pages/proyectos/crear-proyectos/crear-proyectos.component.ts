import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataTypeProject } from 'src/app/models/proyectos.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProyectosService } from '../../../services/proyectos.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { dropdownTypeSkills } from 'src/app/interfaces/proyectos.interface';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-crear-proyectos',
  templateUrl: './crear-proyectos.component.html',
  styleUrls: ['./crear-proyectos.component.css']
})
export class CrearProyectosComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public formCrearProyecto: FormGroup;
  public formSubmitted: boolean = false;
  public dataTypeProject = DataTypeProject;
  public imgUpload: File;
  public dropdownSettings;
  public dropdownList = dropdownTypeSkills;

  constructor(
    private fb: FormBuilder,
    private proyectosSrv: ProyectosService,
    private fileUploadSrv: FileUploadService,
    private toastrSvc: ToastrService,
    private location: Location,
    private element: ElementRef<HTMLElement>,
    private router: Router,
    private spinnerSrv: SpinnerService
  ) {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.formInit();
  }

  public formInit = () => {
    this.formCrearProyecto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      imagenTmp: ['', [Validators.required]],
      imagen: ['temporal'],
      sitio: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required]],
      skillsTmp: ['', [Validators.required]],
      skills: [''],
      descripcion: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deshacer selección'
    };
  };

  public getImagen = (file: File) => {
    let imgTmp = this.element.nativeElement.querySelector('.img-tmp img');
    imgTmp.setAttribute('src', URL.createObjectURL(file));
    this.imgUpload = file;
  };

  public crearProyecto = () => {
    this.formSubmitted = true;

    if (this.formCrearProyecto.invalid) {
      return;
    }
    this.formCrearProyecto.patchValue({
      ['skills']: JSON.stringify(this.formCrearProyecto.get('skillsTmp').value)
    });

    this.spinnerSrv.show();
    this.fileUploadSrv
      .uploadImageServices(this.imgUpload)
      .then(resp => {
        this.formCrearProyecto.patchValue({ ['imagen']: resp.nombreImg });

        this.proyectosSrv
          .insertProjectService(this.formCrearProyecto.value)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (resp: any) => {
              this.toastrSvc.success(`${resp.msg}`, 'Bien!');
              this.spinnerSrv.hide();
              this.router.navigateByUrl('/dashboard/lista-proyectos');
            },
            err => {
              console.log(err);
              this.spinnerSrv.hide();
              this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
            }
          );
      })
      .catch(err => {
        console.log(err);
        this.spinnerSrv.hide();
        this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
      });
  };

  public onTypeIngreSelect = (event: Event) => {};

  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo: any): boolean => {
    if (this.formCrearProyecto.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  };

  goBack() {
    this.location.back();
  }
}
