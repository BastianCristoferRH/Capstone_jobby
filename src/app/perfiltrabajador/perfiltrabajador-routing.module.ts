import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfiltrabajadorPage } from './perfiltrabajador.page';

const routes: Routes = [
  {
    path: '',
    component: PerfiltrabajadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfiltrabajadorPageRoutingModule {}
