import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';


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
    MatLabel
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private ApiService: ApiService) {

    this.loginForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const { vorname, nachname, password } = this.loginForm.value;
      this.login(vorname, nachname, password);
    }
  }


  async login(vorname: string, nachname: string, password: string): Promise<void> {
    const loginData = {vorname,nachname, password};

    try {
      const apiUrl = this.ApiService.getLoginUrl();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });


      if (response.ok) {
        const data = await response.json();


        localStorage.setItem('authToken', data.token);


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
