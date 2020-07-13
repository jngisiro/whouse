import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {
  user: User;
  transactions: Transaction[];
  tabs = [
    'All',
    'Pending',
    'Rejections from Area Manager',
    'Finance Approvals',
  ];

  trans;
  pending;
  approved;
  rejected;
  loading: boolean = false;
  searchKey;
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private auth: AuthService,
    private router: Router,
    private ds: DataService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.auth.user.subscribe((user) => {
      if (user && user.role === 'finance') {
        this.user = user;
      } else {
        this.router.navigate(['/']);
      }
    });

    this.ds.getAllTransaction(null).subscribe((transactions: any) => {
      this.transactions = transactions;
      this.loading = false;

      this.trans = this.transactions.filter((transaction) => {
        return (
          transaction.step === 'finance' ||
          transaction.step === 'manager' ||
          transaction.step === 'accounts' ||
          transaction.step === 'approved'
        );
      });

      // Transactions that are still Open
      this.pending = this.transactions.filter((transaction) => {
        return transaction.step === 'finance';
      });

      // Rejected transactions
      this.rejected = this.transactions.filter(
        (transaction) => transaction.step === 'finance' && transaction.rejected
      );

      // Approved transactions
      this.approved = this.transactions.filter(
        (transaction) =>
          transaction.step === 'manager' ||
          transaction.step === 'accounts' ||
          transaction.step === 'approved'
      );
    });
  }

  applyFilter() {
    this.searchSubject.next(this.searchKey);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
}
