import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from "@angular/core";
import { ClientService } from "./../../../services/client/client.service";
import { Client } from "src/app/models/client";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: "app-client-form",
  templateUrl: "./client_form.component.html",
  styleUrls: ["./client_form.component.css"],
})
export class ClientFormComponent implements OnInit {
  editID: number;
  editMode: boolean = false;
  clientForm: FormGroup;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.editID = +params["clientid"];
      this.editMode = params["clientid"] != null;
      this.createForm(null, null, null, null, null, null);

      if (this.editMode) {
        this.initEditForm();
      }
    });
  }

  initEditForm() {
    this.clientService.getClient(this.editID).subscribe(
      (data) => {
        console.log(data);
        this.createForm(
          data.name,
          data.client_reg_number,
          data.address,
          data.contact,
          data.email,
          data.account_number
        );
        this.clientForm.setValue({
          name: data.name,
          client_reg_number: data.client_reg_number,
          address: data.address,
          contact: data.contact,
          email: data.email,
          account_number: data.account_number,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm(name, client_reg_number, address, contact, email, account_number) {
    this.clientForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      client_reg_number: new FormControl(client_reg_number, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
      address: new FormControl(address, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      contact: new FormControl(contact, Validators.required),
      email: new FormControl(email, [Validators.required, Validators.email]),
      account_number: new FormControl(account_number, [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
    });
  }

  createOrEditClient() {
    const newClient = this.clientForm.value;


    if (this.editMode) {
      console.log(newClient);
      this.clientService
        .updateClient(
          new Client(
            this.editID,
            newClient.name,
            newClient.client_reg_number,
            newClient.address,
            newClient.contact,
            newClient.email,
            newClient.account_number,
            1

          )
        )
        .subscribe(
          (data) => {
            this.clientService.clientEmiter.emit(this.editMode);
            this.redirectTo();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      console.log(newClient);
      this.clientService.createClient(newClient).subscribe(
        (data) => {
          // DODATI I KOMPANIJU KOJOJ PRIPADA
          this.redirectTo();
          this.clientForm.reset();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  redirectTo(){
    if(this.editMode){
      this.router.navigate(['../../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }

  }
}
