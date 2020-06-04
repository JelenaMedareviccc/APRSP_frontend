import { Component, OnInit, Input, Output } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private companyService : CompanyService) { }


  companies : Company[];
  @Input() company: Company = new Company();
  public isViewable: boolean;



  ngOnInit() {

    this.initializeDataSource();
    this.isViewable = true;




  }

  isViewableOutForm($event) {
    this.isViewable = $event;
    this.initializeDataSource();
  }


  initializeDataSource() {
      this.companyService.getCompany(1).subscribe(company =>{
        this.company = company;
        this.companyService.companyEmitter.next(company.companyId);
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
