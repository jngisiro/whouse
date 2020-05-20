import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() comments: any[];
  loading: boolean = false;

  constructor(private data: DataService, private router: ActivatedRoute) {}

  ngOnInit(): void {}

  onComment(form: NgForm) {
    this.loading = true;
    this.data
      .addComment(this.router.snapshot.params['id'], form.value.comment)
      .subscribe(
        (response) => {
          this.loading = false;
          console.log(response);
        },
        (err) => {
          this.loading = false;
          console.log(err);
        }
      );
  }
}
