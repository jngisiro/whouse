import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  loading: boolean = false;
  constructor(private auth: AuthService, private router: Router) {}
  user;

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user && user.role === 'admin') {
        this.user = user;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(form: NgForm) {
    this.loading = true;

    console.log(form.value);

    this.auth.createUser(form.value).subscribe(
      (response) => {
        this.loading = false;
        form.reset();
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }
}
