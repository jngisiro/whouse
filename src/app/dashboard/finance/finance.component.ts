import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {
  user: User;
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
      if (user && user.role === 'finance') {
        this.user = user;
      } else {
        this.router.navigate(['/']);
      }
    });

    this.ds.getAllTransaction(null).subscribe((transactions: any) => {
      this.transactions = transactions;
      this.loading = false;
    });
  }

  onSelect(id) {
    this.router.navigate(['/transaction', id]);
  }

  onSearch($event) {}
}
