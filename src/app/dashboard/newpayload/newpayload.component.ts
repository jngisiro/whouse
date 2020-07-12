import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-newpayload',
  templateUrl: './newpayload.component.html',
  styleUrls: ['./newpayload.component.scss'],
})
export class NewpayloadComponent implements OnInit {
  loading: boolean = false;
  amountCalculated = 0;
  user: User;

  constructor(
    private ds: DataService,
    private router: Router,
    private auth: AuthService,
    private currency: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user && user.role === 'user') this.user = user;
      else this.router.navigate(['/']);
    });
  }

  onSubmit(form: NgForm) {
    this.loading = true;
    form.value.amountToBePaid = this.amountCalculated;
    form.value.submittedBy = `${this.user.firstname} ${this.user.lastname}`;
    console.log(form.value);

    this.ds.createTransaction(form.value).subscribe(
      (response: any) => {
        this.router.navigate(['/user']);

        if (form.value.comment) {
          this.ds
            .addComment(response.data.transaction._id, form.value.comment)
            .subscribe((response) => {
              console.log(response);
              this.loading = false;
            });
        }

        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }
  calculateAmount(value, amount) {
    this.amountCalculated =
      amount.viewModel - (value.source.value / 100) * amount.viewModel;
  }
}
