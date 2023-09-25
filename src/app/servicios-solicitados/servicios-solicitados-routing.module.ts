import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosSolicitadosPage } from './servicios-solicitados.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosSolicitadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosSolicitadosPageRoutingModule {}
