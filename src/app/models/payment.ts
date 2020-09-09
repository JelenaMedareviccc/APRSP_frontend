import { Receipt } from "./receipt";

export class Payment {
  paymentId: number;
  amount: number;
  dateOfIssue: string;
  receipt: Receipt;

  constructor(
    paymentId: number,
    amount: number,
    dateOfIssue: string,
    receipt: Receipt
  ) {
    this.paymentId = paymentId;
    this.amount = amount;
    this.dateOfIssue = dateOfIssue;
    this.receipt = receipt;
  }
}
