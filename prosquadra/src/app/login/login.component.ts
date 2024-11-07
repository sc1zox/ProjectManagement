import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';

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
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    // Überprüfen, ob der Benutzer bereits authentifiziert ist
    const authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      // Benutzer ist authentifiziert, weiter zur Dashboard-Seite
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { vorname, nachname, password } = this.loginForm.value;
      this.login(vorname, nachname, password);
    }
  }

  async login(vorname: string, nachname: string, password: string): Promise<void> {
    const loginData = { vorname, nachname, password };

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
        const error = await response.json();
        alert(`Login failed: ${error.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('There was an error with the login request.');
    }
  }
}
