import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public formResetPassword: FormGroup;
  public awaitResp: boolean = false;
  public txtSuccess: boolean = false;
  public emailUser: string;

  constructor(
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private authSrv: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.formResetPassword = this.fb.group({
      name: ['', [ Validators.required, Validators.minLength(3) ]],
      email: ['', [ Validators.required, Validators.email ]],
    });
  }


  public submitReset = () =>{
    if ( this.formResetPassword.invalid ) { return; }
    
    this.awaitResp = true;
    this.emailUser = this.formResetPassword.get('email').value;
    this.authSrv.recoverPassService(this.formResetPassword.value).pipe(takeUntil(this._unsubscribeAll)).subscribe( resp =>{
      this.txtSuccess = true;
    }, err =>{
      console.log(err);
      this.toastrSvc.error(`${err.error.msg}`, 'Uppsss!');
    })
    this.formResetPassword.reset();
    this.awaitResp = false;
  }

}
