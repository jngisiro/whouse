import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(name: string, email: string, message: string) {
    return this.http.post('https://w-house.herokuapp.com/api/v1/sendemail', {
      name,
      email,
      message,
    });
  }
}
