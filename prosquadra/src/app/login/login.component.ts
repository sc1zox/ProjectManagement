import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {SnackbarService} from '../../services/snackbar.service';
import {UserService} from '../../services/user.service';
import {Login} from '../../types/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    MatButton,
    MatError,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    NgIf,
    MatLabel,
    NgOptimizedImage,
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private userService: UserService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    const authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      await this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.login(username, password);
    }
  }

  async login(username: string, password: string): Promise<void> {
    const loginData: Login = { username, password };

    await this.userService.setCurrentUser(loginData)

    try {
      const apiUrl = this.apiService.getLoginUrl();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();

        this.authService.setToken(data.token);
        this.router.navigate(['/dashboard']);
      } else {
        await response.json();
        this.snackbarService.open("Invalid credentials")
      }
    } catch (error) {
      this.snackbarService.open("Server ist momentan nicht erreichbar")
    }
  }
}
