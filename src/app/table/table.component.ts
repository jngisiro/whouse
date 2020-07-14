import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;

  @Input() data: Transaction[];
  @Input() pending: Transaction[];
  @Input() rejected: Transaction[];
  @Input() approved: Transaction[];
  @Input() tabs: string[];

  ELEMENT_DATA: Transaction[];

  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set content1(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @Input() searchKey: Observable<string>;

  displayedColumns: string[] = [
    'id',
    'deliveryDate',
    'paymentRequisitionDate',
    'submittedBy',
    'payload',
    'location',
    'amountToBePaid',
    'projectCode',
    'paymentVoucherNumber',
    'supplierName',
    'status',
  ];

  dataSource = new MatTableDataSource<Transaction>(this.ELEMENT_DATA);

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataSource.data = this.data;
    this.eventsSubscription = this.searchKey.subscribe((data) =>
      this.onSearch(data)
    );
  }

  onSelect(row) {
    this.router.navigate(['/transaction', row._id]);
  }

  onSearch(data: string) {
    if (data) {
      this.dataSource.filter = data.trim().toLowerCase();
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.dataSource.data = this.data;
        break;
      case 1:
        this.dataSource.data = this.pending;
        break;
      case 2:
        this.dataSource.data = this.rejected;
        break;
      case 3:
        this.dataSource.data = this.approved;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}
