import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';
import * as d3 from 'd3';
import { ClientPayment } from 'src/app/models/clientpayment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { PdfMakerService } from 'src/app/services/pdfMaker/pdf-maker.service';


@Component({
  selector: 'app-payments-percentage-for-clients',
  templateUrl: './payments-percentage-for-clients.component.html',
  styleUrls: ['./payments-percentage-for-clients.component.css']
})
export class PaymentsPercentageForClientsComponent implements OnInit {

  displayedColumns = [
    "clientId",
    "clientName",
    "sumOfPayments",
    "paymentPercentage"
  ];
  dataSource: MatTableDataSource<ClientPayment>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private data;
  private svg;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  private companyId: number;
  companyName: string;
  year: string;

  constructor(private clientService: ClientService,  private router: Router,private pdfMakerService: PdfMakerService,
    private companyService: CompanyService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
   this.route.params.subscribe((params: Params) => {
      this.companyId = +params['companyid'];
      this.route.queryParams.subscribe((params: Params) => {
        this.year = params["year"];
        this.fetchData();
      })


      this.companyService.getCompany(this.companyId).subscribe((data) => {

        this.companyName = data.name;

      });
    });
  }


  fetchData(){
  this.clientService.getClientsPayment(this.companyId, this.year).subscribe(clients => {
    this.data = clients;
  
    this.dataSource =  new MatTableDataSource<ClientPayment>(clients);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
    return data.clientName.toLowerCase().includes(filter);
  };

    this.createSvg();
    this.createColors();
    this.drawChart();

  })


  }

 


applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}

private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.data.map((d:any) => d.paymentPercentage.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}



private drawChart(): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.paymentPercentage));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.data.filter((d:any) => d.paymentPercentage>0)))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d, i) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text(d => (d.data.clientName + " " + d.data.paymentPercentage+"%") )
  .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);

 
}


public openPDF(): void {
  let doc = new jsPDF();

  this.pdfMakerService.pdfMaker(doc, "Percentage of payments for clients", this.companyName, "#myPaymentClientTable")
  

  doc.output("dataurlnewwindow", "Report");
}

public downloadPDF(): void {
  let doc = new jsPDF();
  //this.pdfMaker(doc);
  this.pdfMakerService.pdfMaker(doc,  "Percentage of payments for clients", this.companyName, "#myPaymentClientTable")

  doc.save("report.pdf");
}


}
