import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { DisplayedColumnsPro, Projects, dropdownTypeSkills } from 'src/app/interfaces/proyectos.interface';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { DataTypeProject, ProjectsType } from 'src/app/models/proyectos.model';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-proyectos',
  templateUrl: './lista-proyectos.component.html',
  styleUrls: ['./lista-proyectos.component.css']
})
export class ListaProyectosComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public allProjects: Projects[];
  public dataSource: any;
  public displayedColumns = DisplayedColumnsPro;
  public projectsType = ProjectsType;
  public formEditarProyecto: FormGroup;
  public formSubmitted:boolean = false;
  public dataTypeProject = DataTypeProject;
  public imgUpload: File;
  public dropdownSettings;
  public dropdownList = dropdownTypeSkills;

  constructor(
    private projectsSrv: ProyectosService,
    private fileUploadSrv: FileUploadService,
    private toastrSvc: ToastrService,
    private location: Location,
    private paginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder,
    private element: ElementRef<HTMLElement>,
    private router: Router
  ) {
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.getAllProjects();
    this.formInit();
  }

  public getAllProjects = () =>{
    this.projectsSrv.getAllProjectsService().pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.allProjects = resp.projects || [];
      this.initMatTable(this.allProjects)
    }, err => this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!'))
  }

  public initMatTable = (data:Projects[]) =>{
    this.dataSource = new MatTableDataSource<Projects>(data);
    this.dataSource.paginator = this.paginator;
  }

  public formInit = () =>{
    this.formEditarProyecto = this.fb.group({
      id: [''],
      nombre: ['',[Validators.required, Validators.minLength(3)]],
      imagenTmp: [''],
      imagen: ['temporal'],
      sitio: ['',[Validators.required, Validators.minLength(3)]],
      tipo: ['',[Validators.required]],
      skillsTmp: ['',[Validators.required]],
      skills: [''],
      descripcion: ['',[Validators.required, Validators.minLength(3)]],
    })
  }


  public submitProyectoById = async( ) =>{
    this.formSubmitted = true;

    if ( this.formEditarProyecto.invalid ) {
      return; 
    } 
    if (this.formEditarProyecto.get('imagenTmp').value) {
      this.projectsSrv.deleteImageService(this.formEditarProyecto.get('imagen').value).pipe(takeUntil(this._unsubscribeAll)).subscribe(resp=>{}, err =>{ console.log(err)});

      await this.fileUploadSrv.uploadImageServices(this.imgUpload).then(resp =>{
        this.formEditarProyecto.patchValue({['imagen']: resp.nombreImg });
      }).catch( err => console.log(err));
    }
    
    this.projectsSrv.updateProjectsService(this.formEditarProyecto.value).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.toastrSvc.success(`${resp.msg}`, 'Bien!');
      this.getAllProjects();
      this.closeModal();
    }, err =>{
      console.log(err);
      this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
    })
  }


  public EliminarProyecto = (element:Projects) =>{
    Swal.fire({
      title: '¿Desea eliminar el proyecto?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) =>{
      if (result.isConfirmed){
        //First delete image
        const deleteImg$ = this.projectsSrv.deleteImageService(element.imagen).pipe(takeUntil(this._unsubscribeAll)).subscribe( resp =>{
          console.log('img ', resp);
        }, err => {
          console.log(err);
          deleteImg$.unsubscribe();
        })
        //Second delete project
        const deletePro$ = this.projectsSrv.deleteProjectsService(element.id).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
          this.allProjects = this.allProjects.filter( pro => pro.id !== element.id );
          this.initMatTable(this.allProjects);
          this.toastrSvc.success(`${resp.msg}`, 'Bien!');
        }, (err) =>{
          console.log(err);
          this.toastrSvc.error(`Inténtalo en otro momento...`, 'Uppsss!');
          deletePro$.unsubscribe();
        })
      }
    })
  }


  public modalEditarProyecto = (element:Projects) =>{
    let imgTmp = this.element.nativeElement.querySelector('.img-tmp img');
    imgTmp.setAttribute('src', `https://files.gtsoftweb.com/images/${element.imagen}`);

    this.formEditarProyecto = this.fb.group({
      id: [element.id],
      nombre: [element.nombre,[Validators.required, Validators.minLength(3)]],
      imagenTmp: [''],
      imagen: [element.imagen],
      sitio: [element.sitio,[Validators.required, Validators.minLength(3)]],
      tipo: [element.tipo,[Validators.required]],
      descripcion: [element.descripcion,[Validators.required, Validators.minLength(3)]],
    })
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deshacer selección',
    }
  }


  public getImagen = (file:File) =>{
    let imgTmp = this.element.nativeElement.querySelector('.img-tmp img');
    imgTmp.setAttribute('src', URL.createObjectURL(file))  
    this.imgUpload = file;
  }


  /**
   * Método para validar los campos del formulario
   * @param campo => Campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.formEditarProyecto.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  public onTypeIngreSelect =(event:Event) =>{
  }


  public closeModal = () =>{
    const closeModal:HTMLElement =  this.element.nativeElement.querySelector(`#closeModalEdit`) as HTMLElement;
    closeModal.click();
  }


  public navigateProyecto = (id:string) =>{
    this.router.navigate(['/dashboard/proyectos/editar-proyecto', id])
  }


  goBack(){
    this.location.back();
  }

}
