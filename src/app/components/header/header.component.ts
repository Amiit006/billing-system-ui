// src/app/components/header/header.component.ts - Updated with logout functionality
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private route: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onAddClient() {
    this.route.navigateByUrl("clients/add");
  }

  onViewAllClient() {
    this.route.navigateByUrl("clients/view-clients");
  }

  onLogout() {
    this.authService.logout();
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return this.currentUser.username || 'User';
    }
    return 'User';
  }
}