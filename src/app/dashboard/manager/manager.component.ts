import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit {
  user: User;
  empty: boolean = true;
  currentdate;
  transactions: Transaction[];
  transactionCopy: Transaction[];
  loading: boolean = false;
  fileName = 'Excel-Report.xlsx';
  tab = 'all';
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  report: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private ds: DataService,
    private formatDate: DatePipe,
    private formatCurrency: CurrencyPipe,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.auth.user.subscribe((user) => {
      if (user && user.role === 'manager') {
        this.user = user;
      } else {
        this.router.navigate(['/']);
      }
    });
    this.currentdate = Date.now();

    this.ds.getAllTransaction(null).subscribe((transactions: any) => {
      this.transactions = transactions.data.transactions;
      this.transactionCopy = transactions.data.transactions;
      this.onTab('all');
      this.loading = false;
      if (transactions) this.empty = false;
    });
  }

  onSelect(id) {
    this.router.navigate(['/transaction', id]);
  }

  onTab(tab: string) {
    switch (tab) {
      case 'rejected':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'finance' && transaction.rejected;
        });
        this.tab = 'rejected';
        break;

      case 'rejections':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'manager' && transaction.rejected;
        });
        this.tab = 'rejections';
        break;

      case 'all':
        this.transactions = this.transactionCopy.filter((transactions) => {
          return (
            transactions.step === 'manager' ||
            transactions.step === 'accounts' ||
            (transactions.step === 'finance' && transactions.rejected)
          );
        });
        this.tab = 'all';
        break;

      case 'approved':
        console.log(this.transactions);
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'accounts';
        });
        console.log(this.transactions);
        this.tab = 'approved';
        break;

      case 'pending':
        this.transactions = this.transactionCopy.filter((transaction) => {
          return transaction.step === 'manager';
        });
        this.tab = 'pending';
        break;

      default:
        break;
    }
  }

  onGenerateReport() {
    let report;
    report = this.transactionCopy.map((el) => {
      return {
        'Delivery Date': new Date(el.deliveryDate).toDateString(),
        'Date Submitted': new Date(el.paymentRequisitionDate).toDateString(),
        'Amount To Be Paid': this.formatCurrency.transform(
          el.amountToBePaid,
          'UGX '
        ),
        'Tracking Number': this.decimalPipe.transform(el.id, '3.0'),
        'Invoice Amount': this.formatCurrency.transform(
          el.invoiceAmount,
          'UGX '
        ),
        Description: el.payload,
        'Activity Line': el.activityLine,
        'Payment Voucher Number': el.paymentVoucherNumber,
        'Project Code': el.projectCode,
        'Purchase Order Number': el.purchaseOrderNumber,
        'Withholding Tax': el.withholdingTax + '%',
        Office:
          el.step === 'submitted' || el.step === 'approved'
            ? 'Supply Chain'
            : el.step,
        Status: el.rejected ? 'rejected' : 'pending',
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(report);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, this.fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + new Date().getTime() + this.EXCEL_EXTENSION
    );
  }
}
