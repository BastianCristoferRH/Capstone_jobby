import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarFavoritoPageRoutingModule } from './listar-favorito-routing.module';
import { ListarFavoritoPage } from './listar-favorito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarFavoritoPageRoutingModule
  ],
  declarations: [ListarFavoritoPage]
})
export class ListarFavoritoPageModule {}
