import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { duration } from 'moment';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction;
  id;
  user;
  loading: boolean = false;
  error: boolean = false;
  canEdit: boolean = false;
  timeElapsed;
  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      this.user = user;
    });
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.ds.getTransactionById(params['id']).subscribe(
        (response: any) => {
          this.transaction = response.data.transaction;
          setInterval(() => {
            this.timeElapsed = this.getTime();
          }, 1000);
          if (
            this.user.role === 'user' &&
            this.transaction.step === 'submitted'
          ) {
            this.canEdit = true;
          }
          this.loading = false;
          this.getTime();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    });
  }

  onEdit() {
    this.router.navigate(['edit'], {
      queryParams: { canEdit: true, id: this.transaction._id },
    });
  }

  getTime() {
    const today = new Date().getTime();
    const deliveryDate = new Date(this.transaction.deliveryDate).getTime();

    const difference = today - deliveryDate;
    const seconds = duration(difference).seconds();
    const minutes = duration(difference).minutes();
    const hours = duration(difference).hours();
    const days = duration(difference).days();

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
}
