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
  description: string;
  amountToBePaid?: number;
  paymentRequisitionDate: Date;
  comments?: string[];
  step?: string;
  rejected: false;
}
