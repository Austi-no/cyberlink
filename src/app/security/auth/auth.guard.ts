import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  redirectUrl;
  constructor(private router: Router, private sessionService: SessionService) { }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.sessionService.getToken();
    if (token) {
      return true;
    } else {
      this.redirectUrl = state.url;
      // not logged in so redirect to login page with the return url
      this.router.navigate(["login"]);
      return false;
    }

  }

}
