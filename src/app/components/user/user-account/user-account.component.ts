import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  user: User;
   userId: number;
   username: string;
   showUser: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = userData["id"];
   this.username = userData["username"];
   this.fetchData();
  }

  fetchData() {
      this.userService.getUser(this.userId).subscribe(user =>{
        this.showUser =true;
        this.user = user;
      }, error => {
        console.log(error);
      });

    }

    editUser() {
      this.router.navigate([`edit`], { relativeTo: this.route });
    }

}

