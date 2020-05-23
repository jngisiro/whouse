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
  transactionCopy: Transaction[];
  loading: boolean = false;
  tab = 'all';
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

    this.ds.getAllTransaction('accounts').subscribe((transactions: any) => {
      this.transactions = transactions.data.transactions;
      this.transactionCopy = transactions.data.transactions;
      this.loading = false;
      if (transactions) this.empty = false;
    });
  }

  onSelect(id) {
    this.router.navigate(['/transaction', id]);
  }

  onTab(tab: string) {
    switch (tab) {
      case 'rejected':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return (
            transaction.step === 'manager' || transaction.step === 'finance'
          );
        });
        this.tab = 'rejected';
        break;
      case 'all':
        this.transactions = this.transactionCopy;
        this.tab = 'all';
        break;

      case 'approved':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'approved';
        });
        this.tab = 'approved';
        break;

      case 'pending':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'accounts';
        });
        this.tab = 'pending';
        break;

      default:
        break;
    }
  }
}
