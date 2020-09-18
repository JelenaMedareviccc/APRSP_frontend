import { Component, OnInit } from "@angular/core";
import { ClientService } from "./../../../services/client/client.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CompanyService } from "src/app/services/company/company.service";
import { DialogComponent } from '../../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: "app-client-form",
  templateUrl: "./client_form.component.html",
  styleUrls: ["./client_form.component.css"],
})
export class ClientFormComponent implements OnInit {
  editId: number;
  editMode = false;
  clientForm: FormGroup;
  companyId: number;
  formText: string;
  

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    public dialog: MatDialog
  ) {
  

  }

  ngOnInit() {
    this.createForm(null, null, null, null, null, null);
    this.route.params.subscribe((params: Params) => {
      this.editId = +params["clientid"];
      this.editMode = params["clientid"] != null;
      this.route.parent.params.subscribe((params: Params) => {
        this.companyId = +params["companyid"];
        this.formText = "New client";
        if (this.editId) {
          this.initEditForm();
          this.formText = "Edit client";
        }
      });
    });
  }

  initEditForm() {
    this.clientService.getClient(this.editId).subscribe(
      (client) => {
        this.createForm(
          client.name,
          client.clientRegNumber,
          client.address,
          client.contact,
          client.email,
          client.accountNumber
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(name: string, clientRegNumber: string, address: string, contact: string, email: string, accountNumber: string) {
    this.clientForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(3),
      ]),
      clientRegNumber: new FormControl(clientRegNumber, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.maxLength(40),
      ]),
      contact: new FormControl(contact, [
        Validators.required,
        Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/),
      ]),
      email: new FormControl(email, [Validators.required, Validators.email]),
      accountNumber: new FormControl(accountNumber, [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
  }

  createOrEditClient() {
    let newClient = this.clientForm.value;
    this.companyService.getCompany(this.companyId).subscribe((companyInfo) => {
      const company = { company: companyInfo };
      newClient = { ...newClient, ...company };
      console.log(newClient);
      if (this.editMode) {
        let clientId = { clientId: this.editId };
        newClient = { ...clientId, ...newClient };
        this.clientService.updateClient(newClient).subscribe(
          () => {
            this.redirectTo();
          },
          () => {
            this.openDialog('error');
          }
        );
      } else {
        this.clientService.createClient(newClient).subscribe(
          () => {
            this.redirectTo();
            this.clientForm.reset();
          },
          () => {
            this.openDialog('error');
          }
        );
      }
    });
  }

  redirectTo() {
    this.clientService.clientEmiter.emit(this.editMode);
    if (this.editMode) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }

  openDialog(actionType: string){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { action: actionType},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }

 }
