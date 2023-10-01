import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarTrabajadorPage } from './registrar-trabajador.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarTrabajadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarTrabajadorPageRoutingModule {}
