<<<<<<< HEAD
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
=======
import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user/user.service";
>>>>>>> 57f07c03a2eec1974b0c42389c48a12c0997222f

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit {
  authText: boolean = true;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset) // prati mijenjanje velicine ekrana
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

<<<<<<< HEAD
  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) {}

=======
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService
  ) {}
>>>>>>> 57f07c03a2eec1974b0c42389c48a12c0997222f

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      this.authText = !user;
    });
  }

  redirectTo(uri: string) {
    this.router.navigate([uri]);
  }

  auth() {
    if (JSON.parse(localStorage.getItem("userData"))) {
      if (this.userService.logout()) {
        this.router.navigate(["/signin"]);
      }
    } else {
      this.router.navigate(["/signin"]);
    }
<<<<<<< HEAD

 }

 goBack(){
  this.router.navigate(['../'], {relativeTo: this.route});
 }
=======
>>>>>>> 57f07c03a2eec1974b0c42389c48a12c0997222f
  }
}
