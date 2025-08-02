// src/app/services/auth.service.ts - Fixed version
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface User {
  id: number;
  username: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize with stored user data
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        // Make sure the user object has the token
        user.token = storedToken;
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      this.clearStoredAuth();
      return null;
    }
  }

  private clearStoredAuth(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.baseUrl}auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Debug log
          if (response.success && response.user && response.token) {
            // Store user details and token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
            console.log('User stored successfully:', response.user); // Debug log
          } else {
            console.error('Invalid login response structure:', response);
          }
        })
      );
  }

  logout(): void {
    console.log('Logging out user'); // Debug log
    // Remove user from local storage and set current user to null
    this.clearStoredAuth();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    const token = this.getToken();
    const isAuth = !!(user && token);
    console.log('IsAuthenticated check:', { user: !!user, token: !!token, result: isAuth }); // Debug log
    return isAuth;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const isExpired = now >= expiry;
      
      if (isExpired) {
        console.log('Token is expired'); // Debug log
      }
      
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  // Auto-logout when token expires
  checkTokenExpiry(): void {
    if (this.isTokenExpired()) {
      console.log('Token expired, logging out'); // Debug log
      this.logout();
    }
  }

  // Refresh authentication state on app init
  refreshAuthState(): void {
    const storedUser = this.getStoredUser();
    if (storedUser && !this.isTokenExpired()) {
      this.currentUserSubject.next(storedUser);
    } else {
      this.logout();
    }
  }
}