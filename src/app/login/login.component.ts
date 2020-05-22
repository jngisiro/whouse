import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  user;
  error: string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      this.user = user;

      if (user) this.router.navigate([this.user.role]);
    });
  }

  onSubmit(form: NgForm) {
    this.loading = true;
    const { name, password } = form.value;
    this.auth.loginUser(name, password).subscribe(
      (response) => {
        this.loading = false;
        this.router.navigate([this.user.role]);
      },
      (err) => {
        this.loading = false;
        this.error = err.error.error;
      }
    );
  }
}
