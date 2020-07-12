import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() data: Transaction[];

  ELEMENT_DATA: Transaction[];

  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set content1(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  searchKey: string = '';

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
  }

  onSelect(row) {
    this.router.navigate(['/transaction', row._id]);
  }
}
