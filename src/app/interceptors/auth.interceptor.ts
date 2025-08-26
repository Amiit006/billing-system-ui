// src/app/interceptors/auth.interceptor.ts - Fixed version
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get current user and token
    const currentUser = this.authService.currentUserValue;
    const token = this.authService.getToken();
    
    // Check if request is to API URL
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    const isAuthRequest = request.url.includes('/auth/login');
    
    // Add auth header with token if user is logged in and request is to api url (but not login request)
    if (currentUser && token && isApiUrl && !isAuthRequest) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error); // Debug log
        
        if (error.status === 401) {
          // Auto logout if 401 response returned from api
          this.authService.logout();
        }
        
        return throwError(error);
      })
    );
  }
}