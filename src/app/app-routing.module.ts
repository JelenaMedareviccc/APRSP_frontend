import { ClientTableComponent } from './components/client/client_table/client_table.component';
import { ClientService } from './services/client/client.service';
import { ClientComponent } from './components/client/client.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'client', component: ClientComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
