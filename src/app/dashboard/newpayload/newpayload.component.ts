import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-newpayload',
  templateUrl: './newpayload.component.html',
  styleUrls: ['./newpayload.component.scss'],
})
export class NewpayloadComponent implements OnInit {
  loading: boolean = false;
  amountCalculated = 0;
  invoiceAmounti: any = 0;

  constructor(
    private ds: DataService,
    private router: Router,
    private currency: CurrencyPipe
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.loading = true;
    form.value.amountToBePaid = this.amountCalculated;
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
    this.amountCalculated = amount.viewModel - (value / 100) * amount.viewModel;
  }

  onBlurInvoiceAmount() {
    if (this.invoiceAmounti) {
      this.invoiceAmounti = this.currency.transform(
        this.invoiceAmounti,
        'UGX '
      );
    }
  }
}
