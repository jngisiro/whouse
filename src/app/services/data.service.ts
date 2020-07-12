import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getAllTransaction(step: any) {
    let url = 'https://w-house.herokuapp.com/api/v1/transactions';
    if (step) {
      url = `${url}?step=${step}`;
    }

    return this.http
      .get<Transaction[]>(url)
      .pipe(map((transaction: any) => transaction.data.transactions));
  }

  getTransactionById(id) {
    return this.http.get(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}`
    );
  }

  createTransaction(transaction) {
    return this.http.post('https://w-house.herokuapp.com/api/v1/transactions', {
      ...transaction,
    });
  }

  stepUp(id, step) {
    return this.http.patch(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}`,
      {
        step,
        rejected: false,
      }
    );
  }

  updateTransaction(id, newTransaction) {
    return this.http.patch(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}`,
      {
        ...newTransaction,
        rejected: false,
        step: 'finance',
      }
    );
  }

  stepDown(id, step) {
    return this.http.patch(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}`,
      {
        step,
        rejected: true,
      }
    );
  }

  addComment(id, comment) {
    return this.http.post(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}/comments`,
      {
        message: comment,
      }
    );
  }
}
