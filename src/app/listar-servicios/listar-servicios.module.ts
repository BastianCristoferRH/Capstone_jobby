import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarServiciosPageRoutingModule } from './listar-servicios-routing.module';
import { ListarServiciosPage } from './listar-servicios.page';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarServiciosPageRoutingModule,
    SharedModule  
  ],
  declarations: [ListarServiciosPage]
})
export class ListarServiciosPageModule {}
