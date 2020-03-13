import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './components/company/company.component';
import { ClientComponent } from './components/client/client.component';



const routes: Routes = [{path: 'company', component: CompanyComponent},
{path: 'client', component: ClientComponent},
{ path: '', redirectTo: 'company', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
