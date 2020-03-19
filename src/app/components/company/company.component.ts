import { Component, OnInit, Input, Output } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';
import { Router } from '@angular/router';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private companyService : CompanyService, private router : Router) { }


  companies : Company[];
  @Input() company: Company;
  public isViewable: boolean;



  ngOnInit() {

    this.initializeDataSource();
    this.isViewable = true;

  }

  isViewableOutForm($event) {
    this.isViewable = $event;
  }


  initializeDataSource() {
      this.companyService.getCompany(1).subscribe(company =>{
        console.log("USLO U COMPANY ");
        console.log(company);
        this.company = company;
      }, erros => {});
    }

  getCompanies(){
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;

    } ,  error => {});
  }

  editCompany() {
    this.isViewable = false;

  }




}
