import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor( 
              private authSrv: AuthService,
              private router: Router ){}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      return this.authSrv.validaTokenService().pipe(
        tap( isAuth =>{
          if ( !isAuth ) {
            this.router.navigateByUrl('/login');
          }
        })
      )
  }
  
}
