import { Component, OnInit} from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"],
})
export class CompanyComponent implements OnInit {
  company: Company;
  showCompany: boolean;
  companyId: number;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.showCompany = false;
    this.route.params.subscribe((params: Params) => {

      this.companyId = +params['companyid'];
      this.initializeDataSource();
    });
    
  }

  initializeDataSource() {
   
      this.companyService.getCompany(this.companyId).subscribe(company =>{
        this.showCompany =true;
        this.company = company;
      }, error => {
        console.log(error);
      });

    }

    addNewClient() {
      this.router.navigate(["client/newClient"], { relativeTo: this.route });
    }

}
