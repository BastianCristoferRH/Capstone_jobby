import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarFavoritoPage } from './listar-favorito.page';

const routes: Routes = [
  {
    path: '',
    component: ListarFavoritoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarFavoritoPageRoutingModule {}
