import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarServicioPage } from './modificar-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarServicioPageRoutingModule {}
