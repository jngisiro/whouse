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
  amountCalculated = 0;

  constructor(private ds: DataService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.loading = true;
    form.value.amountToBePaid = this.amountCalculated
    console.log(form.value);

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
  calculateAmount(value, amount){
    this.amountCalculated = amount.viewModel - ((value / 100) * amount.viewModel);
  }
}
