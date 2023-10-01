import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarTrabajadorPageRoutingModule } from './registrar-trabajador-routing.module';

import { RegistrarTrabajadorPage } from './registrar-trabajador.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarTrabajadorPageRoutingModule,
    SharedModule
  ],
  declarations: [RegistrarTrabajadorPage]
})
export class RegistrarTrabajadorPageModule {}
