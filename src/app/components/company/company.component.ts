import { Component, OnInit, Input } from '@angular/core';
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

  ngOnInit() {

    this.initializeDataSource();
  
  }

  
  initializeDataSource() {
      this.companyService.getCompany(1).subscribe(company =>{
        console.log(company)
        this.company = company;
      }, erros => {});
    }

  getCompanies(){
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;

    } ,  error => {});
  }

  

}
