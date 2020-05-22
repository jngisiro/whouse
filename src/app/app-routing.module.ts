import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './dashboard/user/user.component';
import { NewpayloadComponent } from './dashboard/newpayload/newpayload.component';
import { TransactionDetailsComponent } from './dashboard/transaction-details/transaction-details.component';
import { AccountsComponent } from './dashboard/accounts/accounts.component';
import { FinanceComponent } from './dashboard/finance/finance.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { AdminComponent } from './admin/admin.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'finance', component: FinanceComponent },
  { path: 'manager', component: ManagerComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'new', component: NewpayloadComponent },
  { path: 'transaction/:id', component: TransactionDetailsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
