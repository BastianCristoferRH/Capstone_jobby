import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarResenaPage } from './agregar-resena.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarResenaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarResenaPageRoutingModule {}
