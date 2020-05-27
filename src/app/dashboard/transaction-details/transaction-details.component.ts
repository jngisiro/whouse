import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.ds.getTransactionById(params['id']).subscribe(
        (response: any) => {
          this.transaction = response.data.transaction;
          console.log(this.transaction.comments[0]);
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
