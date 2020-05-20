import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './dashboard/user/user.component';
import { NewpayloadComponent } from './dashboard/newpayload/newpayload.component';
import { TransactionDetailsComponent } from './dashboard/transaction-details/transaction-details.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'new', component: NewpayloadComponent },
  { path: 'transaction/:id', component: TransactionDetailsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
