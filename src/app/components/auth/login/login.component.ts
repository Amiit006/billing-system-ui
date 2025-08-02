// src/app/components/auth/login/login.component.ts - Fixed version
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, LoginRequest } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hidePassword = true;
  private authSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.currentUserValue && this.authService.isAuthenticated()) {
      console.log('User already logged in, redirecting to dashboard');
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('Return URL:', this.returnUrl);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.loading = true;
    const credentials: LoginRequest = {
      username: this.f['username'].value.trim(),
      password: this.f['password'].value
    };

    console.log('Attempting login with username:', credentials.username);

    this.authSubscription = this.authService.login(credentials)
      .subscribe({
        next: (response) => {
          console.log('Login response received:', response);
          if (response.success && response.user) {
            this.toastr.success('Login successful!', 'Welcome');
            console.log('Redirecting to:', this.returnUrl);
            
            // Small delay to ensure auth state is updated
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 100);
          } else {
            console.error('Login failed:', response.message);
            this.toastr.error(response.message || 'Login failed', 'Error');
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          let errorMessage = 'Invalid username or password';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.toastr.error(errorMessage, 'Login Failed');
          this.loading = false;
        }
      });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}