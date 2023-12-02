import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarTrabajadorPageRoutingModule } from './registrar-trabajador-routing.module';

import { RegistrarTrabajadorPage } from './registrar-trabajador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarTrabajadorPageRoutingModule
  ],
  declarations: [RegistrarTrabajadorPage]
})
export class RegistrarTrabajadorPageModule {}
