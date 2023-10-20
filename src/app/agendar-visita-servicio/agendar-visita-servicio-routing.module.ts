import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendarVisitaServicioPage } from './agendar-visita-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: AgendarVisitaServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendarVisitaServicioPageRoutingModule {}
