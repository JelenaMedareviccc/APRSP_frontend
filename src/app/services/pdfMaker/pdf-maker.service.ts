import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Injectable({
  providedIn: 'root'
})
export class PdfMakerService {

  constructor() { }


 pdfMaker(doc: jsPDF, reportType: string, companyName: string, tableId: string, ...other: any[]) {
   const clientName = other[0];
   let subject;
   if(clientName){
     subject ="Receipt report" + reportType;
   } else {
     subject= reportType;
   }
    doc.setProperties({
      title: "Report",
      subject: subject,
      author: clientName
    });
    doc.setFontSize(10);

    doc.page = 1; // use this as a counter.

    let footer = function footer() {
      let pageCount = doc.internal.getNumberOfPages();
      for (let i = 0; i < pageCount; i++) {
        doc.setPage(i);
        doc.text(
          100,
          285,
          "Page: " +
            doc.internal.getCurrentPageInfo().pageNumber +
            "/" +
            pageCount
        );
      }
    };

   

    const header = function (headerData: any) {
      doc.setFontSize(20);

      doc.setFontStyle("normal");

      doc.text("REPORT ", headerData.settings.margin.left + 70, 15);

      doc.setFontSize(15);
      doc.text(subject, headerData.settings.margin.left + 55, 25);
      doc.setFontSize(10);
      if(clientName){
        doc.text("Client: " + clientName, headerData.settings.margin.left, 40);

      }
      doc.text("Company: " + companyName, headerData.settings.margin.left, 50);
      let datetime = new Date();

      const date =
        datetime.getDate() +
        "/" +
        (datetime.getMonth() + 1) +
        "/" +
        datetime.getFullYear();
      doc.text("Date: " + date.toString(), headerData.settings.margin.left, 60);
    };
     
    doc.autoTable({
      html: tableId,
      pageBreak: "auto",

      margin: {
        top: 80,
      },
      fontName: "times",
      didDrawPage: header,

      paperSize: {
        format: "A4",
        orientation: "portrait",
        border: "1.8cm",
      },
    });
    doc.autoTable({
      didDrawPage: footer,
    });
    
  }
}
      