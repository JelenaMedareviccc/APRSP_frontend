
export class ClientPayment {
  clientName: String;
  paymentPercentage: number;

  constructor(clientName:String, paymentPercentage: number) {
   this.clientName=clientName;
   this.paymentPercentage= paymentPercentage;
  }
}
