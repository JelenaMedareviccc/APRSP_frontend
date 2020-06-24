import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset) //prati mijenjanje velicine ekrana
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private userService: UserService) {}

  redirectTo(uri:string){
    this.router.navigate([uri])
 
   /*  this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri])); */
 } 

 logout(){
  if(this.userService.logout()){
    this.router.navigate(['/signin']);
  };

 }
  }

