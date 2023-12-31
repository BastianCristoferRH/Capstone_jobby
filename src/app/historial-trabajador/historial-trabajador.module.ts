import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialTrabajadorPageRoutingModule } from './historial-trabajador-routing.module';

import { HistorialTrabajadorPage } from './historial-trabajador.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialTrabajadorPageRoutingModule,
    SharedModule
  ],
  declarations: [HistorialTrabajadorPage]
})
export class HistorialTrabajadorPageModule {}
