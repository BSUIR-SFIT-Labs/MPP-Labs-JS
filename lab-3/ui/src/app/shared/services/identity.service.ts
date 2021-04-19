import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { IdentityDto } from '../dtos/identityDto';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly baseUrl: string = 'http://localhost:3000/user';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {}

  signUp(values: IdentityDto): Observable<boolean> {
    return this.httpClient.post(this.baseUrl + '/create', values).pipe(
      mapTo(true),
      catchError(() => {
        return of(false);
      })
    );
  }

  signIn(values: IdentityDto): Observable<boolean> {
    return this.httpClient.post(this.baseUrl + '/login', values).pipe(
      tap((user: User) => {
        console.log(user);
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      }),
      mapTo(true),
      catchError(() => {
        return of(false);
      })
    );
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
