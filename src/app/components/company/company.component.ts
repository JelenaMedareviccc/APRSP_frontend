import { Component, OnInit, Input, Output } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  company: Company ;
  showCompany: boolean;


  constructor(private companyService : CompanyService, private route: ActivatedRoute,
    private router: Router) { };
 
  ngOnInit() {
    this.showCompany = false;
    this.initializeDataSource();
  }


  initializeDataSource() {
    console.log("Company");
      this.companyService.getCompany(1).subscribe(company =>{
        console.log("Company 1");
        this.showCompany =true;
        this.company = company;
        this.companyService.companyEmitter.next(company.companyId);
      }, error => {});

    }

  editCompany() {
    this.router.navigate(['edit'], {relativeTo: this.route});

  }




}
