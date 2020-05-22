import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

    return this.http.get(url);
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

  addComment(id, comment) {
    return this.http.post(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}/comments`,
      {
        message: comment,
      }
    );
  }
}
