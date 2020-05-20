import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  user: User;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => (this.user = user));
  }

  onLogout() {
    this.auth.logOut();
  }
}
