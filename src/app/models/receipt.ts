import { Client } from "./client";

export class Receipt {
  receiptId: number;
  dateOfIssue: string;
  timeLimit: number;
  totalAmount: number;
  debt: number;
  percentageInterest: number;
  client: Client;

  constructor(dateOfIssue: string, timeLimit: number, client: Client) {
    this.dateOfIssue = dateOfIssue;
    this.timeLimit = timeLimit;
    this.client = client;
  }
}
