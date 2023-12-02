import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosSolicitadosPageRoutingModule } from './servicios-solicitados-routing.module';
import { ServiciosSolicitadosPage } from './servicios-solicitados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosSolicitadosPageRoutingModule
  ],
  declarations: [ServiciosSolicitadosPage]
})
export class ServiciosSolicitadosPageModule {}
