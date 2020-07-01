import { Receipt } from "./receipt";

export class Payment {
  paymentId: number;
  amount: number;
  date_of_issue: string;
  receipt: Receipt;

  constructor(
    paymentId: number,
    amount: number,
    date_of_issue: string,
    receipt: Receipt
  ) {
    this.paymentId = paymentId;
    this.amount = amount;
    this.date_of_issue = date_of_issue;
    this.receipt = receipt;
  }
}
