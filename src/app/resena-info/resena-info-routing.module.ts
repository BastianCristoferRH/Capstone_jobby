import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResenaInfoPage } from './resena-info.page';

const routes: Routes = [
  {
    path: '',
    component: ResenaInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResenaInfoPageRoutingModule {}
