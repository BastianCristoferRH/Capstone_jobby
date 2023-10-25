import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubidaGaleriaPage } from './subida-galeria.page';

const routes: Routes = [
  {
    path: '',
    component: SubidaGaleriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubidaGaleriaPageRoutingModule {}
