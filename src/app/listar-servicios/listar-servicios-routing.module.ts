import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarServiciosPage } from './listar-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ListarServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarServiciosPageRoutingModule {}
