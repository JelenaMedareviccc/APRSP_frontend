import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Company } from 'src/app/models/company';
import {CompanyComponent} from '../company.component';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  @Input() formCompany: Company;

  constructor() { }

  submitted = false;

  onSubmit() { this.submitted = true; }

  ngOnInit(): void {
  }

  

}
