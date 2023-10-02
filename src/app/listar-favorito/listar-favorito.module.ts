import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarFavoritoPageRoutingModule } from './listar-favorito-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListarFavoritoPage } from './listar-favorito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarFavoritoPageRoutingModule,
    SharedModule
  ],
  declarations: [ListarFavoritoPage]
})
export class ListarFavoritoPageModule {}
