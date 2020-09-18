
export class ClientPayment {
  clientId: number;
  clientName: String;
  sumOfPayments: number;
  paymentPercentage: number;

  constructor(clientName:String, paymentPercentage: number, clientId: number, sumOfPayments: number) {
   this.clientName=clientName;
   this.paymentPercentage= paymentPercentage;
   this.clientId = clientId;
   this.sumOfPayments = sumOfPayments;
  }
}
