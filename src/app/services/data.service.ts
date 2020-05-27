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

  stepUp(id, step) {
    return this.http.patch(
      `https://w-house.herokuapp.com/api/v1/transactions/${id}`,
      {
        step,
        rejected: false,
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
