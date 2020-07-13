import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { duration } from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  trans;
  pending;
  approved;
  rejected;
  user: User;
  searchKey;
  searchSubject: Subject<string> = new Subject<string>();

  tabs = ['All', 'Pending', 'Rejections From Finance', 'Approvals For Payment'];

  transactions: Transaction[];
  loading: boolean = false;
  ELEMENT_DATA: Transaction[];

  constructor(
    private auth: AuthService,
    private router: Router,
    private ds: DataService
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user && user.role === 'user') this.user = user;
      else this.router.navigate(['/']);
    });

    // All the transactions in the system
    this.ds.getAllTransaction(null).subscribe((transactions) => {
      this.trans = transactions || [];

      // Transactions that are still Open
      this.pending = this.trans.filter((transaction) => {
        return (
          transaction.step !== 'submitted' && transaction.step !== 'approved'
        );
      });

      // Rejected transactions
      this.rejected = this.trans.filter(
        (transaction) => transaction.step === 'submitted'
      );

      // Approved transactions
      this.approved = this.trans.filter(
        (transaction) => transaction.step === 'approved'
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

  getTimeDifference(date) {
    const deliveryDate = new Date(date).getTime();
    const today = new Date().getTime();

    return duration(today - deliveryDate).days();
  }

  onCreate() {
    this.router.navigate(['/new']);
  }
}
