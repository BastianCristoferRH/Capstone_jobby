import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarResenasPage } from './gestionar-resenas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarResenasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarResenasPageRoutingModule {}
