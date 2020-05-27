import { Component, OnInit, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './../../models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() comments: any[];
  @Input() step;
  loading: boolean = false;
  userSubscription: Subscription;
  user: User;
  submitter;

  constructor(
    private data: DataService,
    private router: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }

  onComment(form: NgForm) {
    if (this.submitter === 'approve') this.onApprove(form);
    else this.onReject(form);
  }

  onApprove(form: NgForm) {
    this.loading = true;

    this.data
      .addComment(this.router.snapshot.params['id'], form.value.comment)
      .subscribe(
        (response) => {
          console.log('Add comment', response);
          this.loading = false;
          this.data
            .stepUp(
              this.router.snapshot.params['id'],
              this.stepUpRole(this.user.role)
            )
            .subscribe(
              (response) => {
                console.log('Step Up', response);
                this.onCommentAdded();
              },
              (err) => {
                console.log('Step Up', err);
              }
            );
        },
        (err) => {
          this.loading = false;
          console.log('Add comment', err);
        }
      );
  }

  onReject(form: NgForm) {
    this.loading = true;

    this.data
      // Add comment. Get transaction's id from the url
      .addComment(this.router.snapshot.params['id'], form.value.comment)
      .subscribe(
        (response) => {
          // Comment has been added
          console.log('Add comment', response);
          this.loading = false;
          // Update the transaction and stepup the position of document
          this.data
            .stepDown(
              this.router.snapshot.params['id'],
              this.stepDownRole(this.user.role)
            )
            .subscribe(
              // Transaction has been updated
              (response) => {
                this.loading = false;
                this.onCommentAdded();
              },
              (error) => {
                // Problem Updating document
                this.loading = false;
                console.log('StepDown', error);
              }
            );
        },
        (err) => {
          // Problem adding the comment
          this.loading = false;
          console.log('Add comment', err);
        }
      );
  }

  stepUpRole(role: string) {
    switch (role) {
      case 'finance':
        return 'manager';
      case 'manager':
        return 'accounts';
      case 'accounts':
        return 'approved';
      default:
        return 'submitted';
    }
  }

  stepDownRole(role: string) {
    switch (role) {
      case 'accounts':
        return 'manager';
      case 'manager':
        return 'finance';
      case 'finance':
        return 'submitted';
      default:
        return 'submitted';
    }
  }

  reject() {
    this.submitter = 'reject';
  }

  approve() {
    this.submitter = 'approve';
  }

  canComment() {
    if (this.user.role === 'user') return false;
    else if (this.user.role !== this.step) return false;
    else return true;
  }

  onCommentAdded() {
    window.location.reload();
  }
}
