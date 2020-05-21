import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  registerUser(user) {
    return this.http.post('https://w-house.herokuapp.com/api/v1/users/signup', {
      ...user,
    });
  }

  createUser(user) {
    return this.http.post('https://w-house.herokuapp.com/api/v1/users', {
      ...user,
    });
  }

  loginUser(email: string, password: string) {
    return this.http
      .post('https://w-house.herokuapp.com/api/v1/users/login', {
        email,
        password,
      })
      .pipe(
        tap((response: any) => {
          // console.log(response);
          this.handleAuth(
            response.data.user.email,
            response.data.user.firstname,
            response.data.user.lastname,
            response.data.user.role,
            response.token,
            response.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const user = new User(
      userData.email,
      userData.firstname,
      userData.lastname,
      userData.role,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (user.gettoken()) {
      this.user.next(user);
    }
  }

  private handleAuth(
    email: string,
    firstname: string,
    lastname: string,
    role: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(
      new Date().getTime() + new Date(expiresIn).getTime()
    );

    const user = new User(
      email,
      firstname,
      lastname,
      role,
      token,
      expirationDate
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logOut() {
    localStorage.removeItem('userData');
    this.user.next(null);
  }
}
