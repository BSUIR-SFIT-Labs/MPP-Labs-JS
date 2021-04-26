import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { IdentityService } from '../services/identity.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityGuard implements CanActivate {
  constructor(
    private identityService: IdentityService,
    private router: Router
  ) {}

  canActivate() {
    if (this.identityService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    return !this.identityService.isLoggedIn();
  }
}
