import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  loading: boolean = false;
  sent = false;

  constructor(private email: EmailService) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.loading = true;
    const { name, email, message } = form.value;
    this.email.sendEmail(name, email, message).subscribe(
      (res) => {
        this.loading = false;
        this.sent = true;
        form.reset();
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
