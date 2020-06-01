import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-payload',
  templateUrl: './edit-payload.component.html',
  styleUrls: ['./edit-payload.component.scss'],
})
export class EditPayloadComponent implements OnInit {
  transaction;
  loading = false;
  loadingData = false;
  amountCalculated = 0;
  newDeliveryDate = '';

  constructor(
    private ds: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.loadingData = true;
      this.ds
        .getTransactionById(queryParams['id'])
        .subscribe((response: any) => {
          this.loadingData = false;
          this.transaction = response.data.transaction;
          this.transaction.deliveryDate = new Date(
            this.transaction.deliveryDate
          );
          this.newDeliveryDate = this.transaction.deliveryDate;
        });
    });
  }

  onSubmit(form: NgForm) {
    this.loading = true;
    form.value.deliveryDate = this.newDeliveryDate;
    console.log(form.value);
    this.ds.updateTransaction(this.transaction._id, form.value).subscribe(
      (response: any) => {
        if (form.value.comment) {
          this.ds
            .addComment(response.data.transaction._id, form.value.comment)
            .subscribe((response) => {
              console.log(response);
              this.loading = false;
              this.router.navigate(['transaction', this.transaction._id]);
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
}
