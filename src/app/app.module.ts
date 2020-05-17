import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './dashboard/user/user.component';
import { FinanceComponent } from './dashboard/finance/finance.component';
import { ManagerComponent } from './dashboard/manager/manager.component';
import { AccountsComponent } from './dashboard/accounts/accounts.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    FinanceComponent,
    ManagerComponent,
    AccountsComponent,
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
