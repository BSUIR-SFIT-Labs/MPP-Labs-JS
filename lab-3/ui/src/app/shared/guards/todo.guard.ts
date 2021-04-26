import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { IdentityService } from '../services/identity.service';

@Injectable({
  providedIn: 'root',
})
export class TodoGuard implements CanActivate, CanLoad {
  constructor(
    private identityService: IdentityService,
    private router: Router
  ) {}

  canLoad() {
    if (!this.identityService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
    }
    return this.identityService.isLoggedIn();
  }

  canActivate() {
    return this.canLoad();
  }
}
