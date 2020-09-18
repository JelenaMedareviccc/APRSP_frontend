import { Component, OnInit} from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { Company } from 'src/app/models/company';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};



@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]

    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},


  ],
})
export class CompanyComponent implements OnInit {
  company: Company;
  showCompany: boolean;
  companyId: number;
  showYearPicker: boolean;
  year: FormControl;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.showYearPicker=false;
    this.showCompany = false;
    this.route.params.subscribe((params: Params) => {

      this.companyId = +params['companyid'];
      this.initializeDataSource();
    });

  }

  initializeDataSource() {
    this.year = new FormControl(moment(), Validators.required);
      this.companyService.getCompany(this.companyId).subscribe(company =>{
        this.company = company;
        this.showCompany =true;
      }, error => {
        console.log(error);
      });

    }

    addNewClient() {
      this.router.navigate(["client/newClient"], { relativeTo: this.route });
    }


  chosenYearHandler(normalizedYear: Moment,  datepicker: MatDatepicker<Moment>) {
    if(this.year.value !== null){
      const ctrlValue = this.year.value;
      ctrlValue.year(normalizedYear.year());

     this.year.setValue(ctrlValue);
     datepicker.close();

    }
  }

  showYearChooserForPayments(){
    this.showYearPicker=!this.showYearPicker;

  }

  clientsPaymentPerYear(){
    this.router.navigate(["paymentPercentageForClients"], {
      relativeTo: this.route,
      queryParams: { year: this.year.value.format("YYYY") },
    });
  }

  showPaymentsFor365Days(){
    this.router.navigate(["paymentsForLast365Days"], {
      relativeTo: this.route
    });

  }


}
