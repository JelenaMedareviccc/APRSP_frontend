import { CompanyService } from 'src/app/services/company/company.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Company } from 'src/app/models/company';
import {CompanyComponent} from '../company.component';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  @Input() formCompany: Company;
  @Output() isViewableOutput =  new EventEmitter<boolean>();

  private isViewable : boolean;

  private company: Company;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
  }


  updateCompany(company: NgForm){
    console.log(this.formCompany.companyId);

    this.company = company.value;
    this.company.companyId = this.formCompany.companyId;
    console.log(this.company);

    this.companyService.updateCompany(this.company).subscribe(data => {
      this.isViewable = true;
      this.isViewableOutput.emit(this.isViewable);
      return true;
    },
    error => {
      console.log(error);
     });
  }



}
