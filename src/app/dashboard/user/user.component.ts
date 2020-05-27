import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
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
      if (user && user.role === 'user') this.user = user;
      else this.router.navigate(['/']);
    });
    this.currentdate = Date.now();

    this.ds.getAllTransaction(null).subscribe((transactions: any) => {
      this.transactions = transactions.data.transactions;
      console.log(this.transactions);
      this.transactionCopy = transactions.data.transactions;
      this.loading = false;
      if (transactions) this.empty = false;
    });
  }

  onTab(tab: string) {
    switch (tab) {
      case 'pending':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return (
            (transaction.step === 'finance' && !transaction.rejected) ||
            (transaction.step === 'manager' && !transaction.rejected) ||
            (transaction.step === 'accounts' && !transaction.rejected)
          );
        });
        this.tab = 'pending';
        break;

      case 'rejected':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'submitted';
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

      default:
        break;
    }
  }

  onSelect(id) {
    this.router.navigate(['/transaction', id]);
  }
}
