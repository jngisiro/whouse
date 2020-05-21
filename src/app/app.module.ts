import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './dashboard/user/user.component';
import { FinanceComponent } from './dashboard/finance/finance.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { AccountsComponent } from './dashboard/accounts/accounts.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/authInterceptor.service';
import { TransactionComponent } from './dashboard/transaction/transaction.component';
import { TransactionDetailsComponent } from './dashboard/transaction-details/transaction-details.component';
import { NewpayloadComponent } from './dashboard/newpayload/newpayload.component';
import { CommentsComponent } from './dashboard/comments/comments.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    FinanceComponent,
    ManagerComponent,
    AccountsComponent,
    NavigationComponent,
    FooterComponent,
    LoadingComponent,
    TransactionComponent,
    TransactionDetailsComponent,
    NewpayloadComponent,
    CommentsComponent,
    AdminComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
