import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { duration } from 'moment';

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

  onSearch($event) {
    let val: string = (event.target as any).value;
    let regx = new RegExp(val);
    if (val) {
      if (val.startsWith('0')) {
        val = val.substr(1, val.length);
      } else if (val.startsWith('00')) {
        console.log(val);
        val = val.substr(2, val.length);
      }
      this.transactions = this.transactionCopy.filter((transaction) => {
        return transaction.id.toString().indexOf(val) !== -1;
      });
    } else {
      this.transactions = this.transactionCopy;
    }
  }

  getTimeDifference(date) {
    const deliveryDate = new Date(date).getTime();
    const today = new Date().getTime();

    return duration(today - deliveryDate).days();
  }
}
