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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  trans;
  user: User;
  currentdate;
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
    this.currentdate = Date.now();

    this.ds.getAllTransaction(null).subscribe((transactions) => {
      this.trans = transactions;
    });
  }

  onSearch($event) {
    let val: string = (event.target as any).value;
    const currentTransactions = this.transactions;
    if (val) {
      if (val.startsWith('0') || val.startsWith('00')) {
        val = val.substr(1, val.length);
      }
      this.transactions = currentTransactions.filter((transaction) => {
        return transaction.id.toString().indexOf(val) !== -1;
      });
    } else {
      this.transactions = currentTransactions;
    }
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
