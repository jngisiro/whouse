import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newpayload',
  templateUrl: './newpayload.component.html',
  styleUrls: ['./newpayload.component.scss'],
})
export class NewpayloadComponent implements OnInit {
  loading: boolean = false;

  constructor(private ds: DataService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.loading = true;
    form.value.payload = form.value.payload.split('\n');

    this.ds.createTransaction(form.value).subscribe(
      (response) => {
        console.log(response);
        this.loading = false;
        this.router.navigate(['/user']);
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }
}
