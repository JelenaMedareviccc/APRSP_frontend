import { ClientTableComponent } from './components/client/client_table/client_table.component';
import { ClientService } from './services/client/client.service';
import { ClientComponent } from './components/client/client.component';

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
