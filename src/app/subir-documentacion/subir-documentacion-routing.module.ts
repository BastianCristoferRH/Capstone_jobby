import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubirDocumentacionPage } from './subir-documentacion.page';

const routes: Routes = [
  {
    path: '',
    component: SubirDocumentacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubirDocumentacionPageRoutingModule {}
