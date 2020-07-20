export interface Transaction {
  _id?: string;
  id?: string;
  deliveryDate: Date;
  userid: string;
  payload: string[];
  paymentVoucherNumber: number;
  purchaseOrderNumber: number;
  projectCode: string;
  activityLine: string;
  supplierName?: string;
  location?: string;
  invoiceAmount?: number;
  withholdingTax?: number;
  description: string;
  amountToBePaid?: number;
  paymentRequisitionDate: Date;
  submittedBy?: string;
  comments?: string[];
  step?: string;
  rejected: false;
}
