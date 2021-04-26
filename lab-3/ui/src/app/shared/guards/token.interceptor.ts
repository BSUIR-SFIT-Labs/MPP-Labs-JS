import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      request = this.addAccessTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/sign-in');
          return next.handle(
            this.addAccessTokenToRequest(request, token ?? '')
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addAccessTokenToRequest(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }
}
