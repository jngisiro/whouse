import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction;
  id;
  loading: boolean = false;
  error: boolean = false;
  constructor(private ds: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.ds.getTransactionById(params['id']).subscribe(
        (response: any) => {
          console.log(response);
          this.transaction = response.data.transaction;
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    });
  }
}
