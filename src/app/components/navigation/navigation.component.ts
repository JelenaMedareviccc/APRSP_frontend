import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import {Location} from '@angular/common';

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})
export class NavigationComponent implements OnInit, OnDestroy {
  authText: boolean = true;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;



  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset) // prati mijenjanje velicine ekrana
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private _location: Location,
              changeDetectorRef: ChangeDetectorRef, 
              media: MediaMatcher) {
                this.mobileQuery = media.matchMedia('(max-width: 600px)');
                this._mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this._mobileQueryListener);
              }
              
            

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      this.authText = !user;
    });
  }
  
  auth() {
    if (JSON.parse(localStorage.getItem("userData"))) {
      if (this.userService.logout()) {
        this.router.navigate(["/signin"]);
      }
    } else {
      this.router.navigate(["/signin"]);
    }

 }

 goBack(){

  this._location.back();
  //this.router.navigate(["../"], { relativeTo: this.route });

}

myAccount(){
  let userData = JSON.parse(localStorage.getItem("userData")); 
  const id = userData["id"];
  this.router.navigate([`user/${id}`]);
}

ngOnDestroy(): void {
  this.mobileQuery.removeListener(this._mobileQueryListener);
}





  
}
