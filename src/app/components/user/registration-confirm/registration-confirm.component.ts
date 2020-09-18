import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-registration-confirm',
  templateUrl: './registration-confirm.component.html',
  styleUrls: ['./registration-confirm.component.css']
})
export class RegistrationConfirmComponent implements OnInit {

  constructor( private userService: UserService, 
    private route: ActivatedRoute,private router: Router,) { }

  ngOnInit(): void {
    this.registrationConfirm();
    
  }

  registrationConfirm(){
    this.route.queryParams.subscribe((params: Params) => {
      const token = params["token"];
      console.log(token);
      this.userService.comfirmRegistration(token).subscribe(user => {
        console.log(user);
        this.router.navigate(["../company/newCompany"], { relativeTo: this.route });
      }, error => {
       //dialog
        
      })
     
    })
  }

}
