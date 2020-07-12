import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  user: User;
  empty: boolean = true;
  currentdate;
  transactions: Transaction[];
  loading: boolean = false;

  tabs = ['All', 'Pending', 'Accounts Rejections', 'Approvals from Accounts'];

  trans;
  pending;
  approved;
  rejected;

  constructor(
    private auth: AuthService,
    private router: Router,
    private ds: DataService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.auth.user.subscribe((user) => {
      if (user && user.role === 'accounts') {
        this.user = user;
      } else {
        this.router.navigate(['/']);
      }
    });
    this.currentdate = Date.now();

    this.ds.getAllTransaction(null).subscribe((transactions: any) => {
      this.transactions = transactions;
      this.loading = false;

      this.trans = this.transactions.filter((transaction) => {
        return (
          transaction.step === 'accounts' || transaction.step === 'approved'
        );
      });

      // Transactions that are still Open
      this.pending = this.transactions.filter((transaction) => {
        return transaction.step === 'accounts';
      });

      // Rejected transactions
      this.rejected = this.transactions.filter(
        (transaction) => transaction.step === 'manager' && transaction.rejected
      );

      // Approved transactions
      this.approved = this.transactions.filter(
        (transaction) => transaction.step === 'approved'
      );
    });
  }

  onSearch($event) {}
}
