import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarServiciosPageRoutingModule } from './listar-servicios-routing.module';

import { ListarServiciosPage } from './listar-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarServiciosPageRoutingModule
  ],
  declarations: [ListarServiciosPage]
})
export class ListarServiciosPageModule {}
