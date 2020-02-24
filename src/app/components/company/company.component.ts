import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private companyService : CompanyService) { }


  data : Company[];
  ngOnInit() {

    this.companyService.getCompanies().subscribe((data) => {
      this.data = data;
    })
  }

}
