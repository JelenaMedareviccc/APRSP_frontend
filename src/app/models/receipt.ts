import { Client } from "./client";

export class Receipt {
  receiptId: number;
  date_of_issue: string;
  time_limit: number;
  total_amount: number;
  dept: number;
  client: Client;

  constructor(date_of_issue: string, time_limit: number, client: Client) {
    this.date_of_issue = date_of_issue;
    this.time_limit = time_limit;
    this.client = client;
  }
}
