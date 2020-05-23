import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit {
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
      if (user && user.role === 'manager') {
        this.user = user;
      } else {
        this.router.navigate(['/']);
      }
    });
    this.currentdate = Date.now();

    this.ds.getAllTransaction('manager').subscribe((transactions: any) => {
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
          return transaction.step === 'finance' && transaction.rejected;
        });
        this.tab = 'rejected';
        break;
      case 'all':
        this.transactions = this.transactionCopy;
        this.tab = 'all';
        break;

      case 'approved':
        this.transactions = this.transactionCopy.filter((transaction) => {
          transaction.step === 'accounts';
        });
        this.tab = 'approved';
        break;

      case 'pending':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'manager';
        });
        this.tab = 'pending';
        break;

      default:
        break;
    }
  }
}
