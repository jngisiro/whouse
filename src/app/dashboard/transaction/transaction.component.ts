import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  transaction: Transaction;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {}
}
