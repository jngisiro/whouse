import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { DataService } from 'src/app/services/data.service';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Subject } from 'rxjs';

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

  trans;
  pending;
  approved;
  rejected;
  tabs = [
    'All',
    'Pending',
    'Rejections from Accounts',
    'Area Manager Approvals',
  ];

  searchKey;
  searchSubject: Subject<string> = new Subject<string>();

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
      this.transactions = transactions;
      this.transactionCopy = transactions;
      if (transactions) this.empty = false;

      // All Transactions
      this.trans = this.transactions.filter((transaction) => {
        return (
          transaction.step === 'manager' ||
          transaction.step === 'accounts' ||
          transaction.step === 'approved' ||
          (transaction.step === 'finance' && transaction.rejected)
        );
      });

      // Transactions that are still Open
      this.pending = this.transactions.filter((transaction) => {
        return transaction.step === 'manager';
      });

      // Rejected transactions
      this.rejected = this.transactions.filter(
        (transaction) => transaction.step === 'manager' && transaction.rejected
      );

      // Approved transactions
      this.approved = this.transactions.filter(
        (transaction) =>
          transaction.step === 'accounts' || transaction.step === 'approved'
      );

      this.loading = false;
    });
  }

  onGenerateReport() {
    let report;
    report = this.transactionCopy.map((el) => {
      return {
        'Delivery Date': new Date(el.deliveryDate).toDateString(),
        'Date Submitted': new Date(el.paymentRequisitionDate).toDateString(),
        RFPNO: el.paymentVoucherNumber,
        Requester: el.supplierName,
        Location: el.location,
        PO: el.purchaseOrderNumber,
        Description: el.payload,
        'Project Code': el.projectCode,
        'Activity Line': el.activityLine,
        Currency: 'UGX',
        'Invoice Amount': this.formatCurrency.transform(
          el.invoiceAmount,
          'UGX '
        ),
        'Withholding Tax': el.withholdingTax + '%',
        'Amount Payable': this.formatCurrency.transform(
          el.amountToBePaid,
          'UGX '
        ),
        Office:
          el.step === 'submitted' || el.step === 'approved'
            ? 'Supply Chain'
            : el.step,
        Status: el.step !== 'approved' ? 'Open' : 'Closed',
        TNO: this.decimalPipe.transform(el.id, '3.0'),
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

  applyFilter() {
    this.searchSubject.next(this.searchKey);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
}
