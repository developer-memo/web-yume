import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public formNewPassword: FormGroup;
  public awaitResp: boolean = false;
  public token: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private authSrv: AuthService,
    private spinnerSrv: SpinnerService
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe( resp =>{
      this.token = resp.get('token');
    })

    this.formNewPassword = this.fb.group({
      pass: ['', [ Validators.required]],
      confirmPass: ['', [ Validators.required]],
      token: ['']
    });
  }



  public submitNewPassword = () =>{
    if ( this.formNewPassword.invalid ) { return; }
    if (!this.validateBothPass(this.formNewPassword.value)) { return; }

    this.formNewPassword.patchValue({['token']: this.token });

    this.awaitResp = true;
    this.spinnerSrv.show()
    this.authSrv.newPassService(this.formNewPassword.value).pipe(takeUntil(this._unsubscribeAll)).subscribe( (resp:any) =>{
      this.toastrSvc.success(`${resp.msg}`, 'Bien!');
      this.spinnerSrv.hide()
      setTimeout(() => { this.router.navigateByUrl('/login');}, 1000);
    }, err =>{
      console.log(err);
      this.spinnerSrv.hide()
      this.toastrSvc.error(`${err.error.msg}`, 'Uppsss!');
    })
    this.awaitResp = false;
  }



  //Validate both passwords
  public validateBothPass = (data:any):boolean =>{
    if (data.pass !== data.confirmPass) {
      this.toastrSvc.error(`Las contraseñas no coinciden.`, 'Uppsss!');
      return false;
    } else {
      return true;
    }
  }




}
