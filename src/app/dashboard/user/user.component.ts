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
  loading: boolean = false;
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

    this.ds.getAllTransaction().subscribe((transactions: any) => {
      this.transactions = transactions.data.transactions;
      this.loading = false;
      if (transactions) this.empty = false;
    });
  }

  onSelect(id) {
    this.router.navigate(['/transaction', id]);
  }
}
